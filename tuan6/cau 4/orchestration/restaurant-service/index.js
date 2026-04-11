const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("restaurant.queue", { durable: true });
  await channel.bindQueue(q.queue, exchange, "restaurant.prepare");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("[Restaurant] Preparing food:", order.id);

    channel.publish(
      exchange,
      "restaurant.prepared",
      Buffer.from(JSON.stringify({ ...order, kitchenStatus: "PREPARED" }))
    );

    channel.ack(msg);
  });

  console.log("Restaurant service running");
})();
