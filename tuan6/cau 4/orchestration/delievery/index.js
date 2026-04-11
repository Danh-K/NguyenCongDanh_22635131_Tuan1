const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("delivery.queue", { durable: true });
  await channel.bindQueue(q.queue, exchange, "delivery.dispatch");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("[Delivery] Delivering order:", order.id);

    channel.publish(
      exchange,
      "delivery.completed",
      Buffer.from(JSON.stringify({ ...order, deliveryStatus: "DONE" }))
    );

    channel.ack(msg);
  });

  console.log("Delivery service running");
})();
