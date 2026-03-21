const express = require('express');
const connectDB = require('./db');
const Product = require('./models/product.model');
const Order = require('./models/order.model');
const amqp = require('amqplib');
const app = express();

app.use(express.json());

// Kết nối DB
connectDB();

// === CẤU HÌNH RABBITMQ ===
const QUEUE_NAME = 'flashsale_orders';
let channel, connection;

async function connectRabbitMQ() {
    try {
        connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ RabbitMQ connected");
    } catch (error) {
        console.error("❌ RabbitMQ connect failed", error);
        // Retry logic could go here
    }
}
// Kết nối RabbitMQ (nếu chạy mode có MQ)
if (process.env.USE_MQ === 'true') {
    connectRabbitMQ();
}

// === KHỞI TẠO DỮ LIỆU ===
async function initData() {
    const p = await Product.findOne({ name: 'iphone15' });
    if (!p) {
        await Product.create({ name: 'iphone15', stock: 100 });
        console.log("Đã tạo sản phẩm mẫu: iphone15 (stock: 100)");
    }
}
initData();

// === CASE 1: KHÔNG DÙNG MQ (XỬ LÝ TRỰC TIẾP) ===
app.post('/buy-no-mq', async (req, res) => {
    const { userId } = req.body;
    
    try {
        // Dùng transaction để đảm bảo tính nhất quán (nếu dùng MongoDB Replica Set)
        // Ở đây demo đơn giản atomic update
        const product = await Product.findOneAndUpdate(
            { name: 'iphone15', stock: { $gt: 0 } },
            { $inc: { stock: -1 } },
            { new: true }
        );

        if (product) {
            // Còn hàng -> tạo đơn
            const order = await Order.create({ userId, status: 'success' });
            return res.json({ success: true, msg: 'Mua thành công', orderId: order._id });
        } else {
            // Hết hàng
            return res.status(400).json({ success: false, msg: 'Hết hàng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: 'Lỗi server' });
    }
});


// === CASE 2: DÙNG MQ (ĐẨY VÀO HÀNG ĐỢI) ===
app.post('/buy-with-mq', async (req, res) => {
    const { userId } = req.body;

    if (!channel) {
        return res.status(500).json({ msg: 'RabbitMQ chưa sẵn sàng' });
    }

    const orderData = { userId, timestamp: Date.now() };
    
    // Gửi message vào queue, không xử lý DB ngay tại đây
    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(orderData)), { persistent: true });

    // Phản hồi ngay lập tức cho user
    res.json({ success: true, msg: 'Đang xử lý đơn hàng, vui lòng chờ...' });
});

// Worker xử lý queue (Chạy ngầm trong cùng process hoặc tách process riêng)
async function startWorker() {
    if (!channel) return;
    
    console.log("👷 Worker started processing orders...");
    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;
        
        const data = JSON.parse(msg.content.toString());
        // console.log("Processing order for user:", data.userId);

        try {
             // Logic xử lý giống hệt Case 1 nhưng chạy ở background
            const product = await Product.findOneAndUpdate(
                { name: 'iphone15', stock: { $gt: 0 } },
                { $inc: { stock: -1 } },
                { new: true }
            );

            if (product) {
                await Order.create({ userId: data.userId, status: 'success' });
                // Có thể bắn noti cho user báo thành công ở đây
            } else {
                 await Order.create({ userId: data.userId, status: 'failed' });
                 // Bắn noti báo hết hàng
            }

            channel.ack(msg); // Xác nhận đã xử lý xong
        } catch (error) {
            console.error("Worker error:", error);
            channel.nack(msg); // Nếu lỗi thì trả lại hàng đợi (hoặc đẩy vào DLQ)
        }
    }); // , { noAck: false } mặc định
}

// Khởi chạy worker nếu dùng MQ
if (process.env.USE_MQ === 'true') {
    // Đợi 1 chút cho kết nối RabbitMQ xong
    setTimeout(startWorker, 2000); 
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server chạy tại port ${PORT}`);
});
