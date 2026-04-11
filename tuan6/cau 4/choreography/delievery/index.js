const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("delivery.queue");
  await channel.bindQueue(q.queue, exchange, "food.prepared");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("Delivering order:", order.id);

    channel.ack(msg);
  });
})();