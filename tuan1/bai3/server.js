const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const OrderEmail = require('./order.model');
const amqp = require('amqplib');

dotenv.config();

const app = express();
app.use(express.json());

// Kết nối DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ DB Error:', err));

// === CẤU HÌNH RABBITMQ ===
const QUEUE_NAME = 'email_queue';
let channel, connection;

async function connectRabbitMQ() {
    try {
        // Dùng guest:guest cho RabbitMQ mặc định
        connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        channel = await connection.createChannel();
        await channel.assertQueue(QUEUE_NAME, { durable: true });
        console.log("✅ RabbitMQ connected");
        
        // Khởi động worker ngay khi kết nối thành công
        startWorker();
    } catch (error) {
        console.error("❌ RabbitMQ connect failed", error);
    }
}
connectRabbitMQ();

// Hàm giả lập gửi email (blocking - tốn thời gian)
const sendEmail = async (email, orderId) => {
    console.log(`📧 [Start] Đang gửi email xác nhận cho đơn hàng ${orderId} tới ${email}...`);
    
    // Giả lập độ trễ 3-5 giây
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log(`📨 [End] Đã gửi email thành công cho ${email}!`);
    return true;
};

/* 
  API Đặt hàng - Case KHÔNG dùng Queue (Blocking)
*/
app.post('/order', async (req, res) => {
    const { userId, email, total } = req.body;
    const startTime = Date.now();

    try {
        console.log(`\n--- [Blocking] Nhận đơn hàng từ ${userId} ---`);

        // 1. Phải chờ gửi mail xong
        await sendEmail(email, "TEMP_ID");

        // 2. Lưu vào DB
        const newOrder = await OrderEmail.create({
            userId,
            email,
            total,
            status: 'completed',
            emailSent: true
        });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        res.json({
            success: true,
            message: 'Đặt hàng thành công! (Blocking)',
            order: newOrder,
            duration: `${duration}s`
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

/* 
  API Đặt hàng - Case CÓ dùng Queue (Non-Blocking)
  Quy trình:
  1. Nhận Request
  2. Đẩy task vào RabbitMQ -> Trả response NGAY LẬP TỨC
  3. Worker ở dưới sẽ từ từ xử lý gửi mail và lưu DB
*/
app.post('/order-mq', async (req, res) => {
    const { userId, email, total } = req.body;
    const startTime = Date.now();

    if (!channel) {
        return res.status(500).json({ message: "RabbitMQ chưa sẵn sàng" });
    }

    try {
        console.log(`\n--- [MQ] Nhận đơn hàng từ ${userId} ---`);

        const orderData = { userId, email, total };

        // 1. Gửi vào hàng đợi (Cực nhanh)
        channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(orderData)), { persistent: true });

        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;

        // 2. Trả về ngay cho user
        res.json({
            success: true,
            message: 'Đặt hàng thành công! Đơn hàng đang được xử lý ngầm.',
            duration: `${duration}s` // Sẽ cực nhỏ (vd: 0.005s)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Lỗi hệ thống' });
    }
});

// === WORKER XỬ LÝ BACKGROUND ===
function startWorker() {
    channel.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        console.log(`👷 [Worker] Nhận task xử lý cho: ${data.userId}`);

        try {
            // Xử lý logic nặng ở đây (Gửi mail + Lưu DB)
            
            // 1. Giả lập gửi mail (Tốn 3s)
            await sendEmail(data.email, "MQ_ID");

            // 2. Lưu vào DB sau khi gửi mail xong
            await OrderEmail.create({
                userId: data.userId,
                email: data.email,
                total: data.total,
                status: 'completed',
                emailSent: true
            });

            console.log(`✅ [Worker] Hoàn tất đơn hàng cho ${data.userId}`);
            
            // Xác nhận đã xong task
            channel.ack(msg);
        } catch (err) {
            console.error("Worker Error:", err);
            // Nếu lỗi có thể nack để xử lý lại sau
            channel.nack(msg);
        }
    }); // { noAck: false } là default
}

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
    console.log(`Server chạy tại port ${PORT}`);
});
