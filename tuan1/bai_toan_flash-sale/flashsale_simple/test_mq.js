const amqp = require('amqplib');

async function testConnection() {
    console.log("Testing guest:guest...");
    try {
        const conn1 = await amqp.connect('amqp://guest:guest@localhost:5672');
        console.log("✅ Success with guest:guest");
        conn1.close();
    } catch (e) {
        console.log("❌ Failed guest:guest:", e.message);
    }

    console.log("Testing user:password...");
    try {
        const conn2 = await amqp.connect('amqp://user:password@localhost:5672');
        console.log("✅ Success with user:password");
        conn2.close();
    } catch (e) {
        console.log("❌ Failed user:password:", e.message);
    }
}

testConnection();
