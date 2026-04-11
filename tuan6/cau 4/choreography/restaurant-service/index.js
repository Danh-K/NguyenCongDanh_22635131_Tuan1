const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("restaurant.queue");
  await channel.bindQueue(q.queue, exchange, "payment.completed");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("Preparing food:", order.id);

    const event = {
      ...order,
      status: "PREPARED"
    };

    channel.publish(
      exchange,
      "food.prepared",
      Buffer.from(JSON.stringify(event))
    );

    channel.ack(msg);
  });
})();