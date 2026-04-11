const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("payment.queue", { durable: true });
  await channel.bindQueue(q.queue, exchange, "payment.process");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("[Payment] Processing payment:", order.id);

    channel.publish(
      exchange,
      "payment.completed",
      Buffer.from(JSON.stringify({ ...order, paymentStatus: "SUCCESS" }))
    );

    channel.ack(msg);
  });

  console.log("Payment service running");
})();
