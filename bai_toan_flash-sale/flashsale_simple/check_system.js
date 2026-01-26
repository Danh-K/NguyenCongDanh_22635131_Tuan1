const amqp = require('amqplib');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env
const envPath = path.resolve(__dirname, '.env');
dotenv.config({ path: envPath });

async function check() {
    console.log("=== KIỂM TRA HỆ THỐNG ===");
    
    // 1. Check RabbitMQ
    console.log("1. Checking RabbitMQ (guest:guest)...");
    try {
        const conn = await amqp.connect('amqp://guest:guest@localhost:5672');
        console.log("   ✅ RabbitMQ OK");
        await conn.close();
    } catch (e) {
        console.log("   ❌ RabbitMQ Failed:", e.message);
    }

    // 2. Check MongoDB
    console.log("2. Checking MongoDB...");
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
        console.log("   ❌ MONGO_URI missing in .env");
    } else {
        try {
            await mongoose.connect(mongoUri);
            console.log("   ✅ MongoDB OK");
            await mongoose.disconnect();
        } catch (e) {
            console.log("   ❌ MongoDB Failed:", e.message);
        }
    }
    console.log("=== KẾT THÚC ===");
}

check();
