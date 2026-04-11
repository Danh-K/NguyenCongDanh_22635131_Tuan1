// payment-service/index.js
const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const q = await channel.assertQueue("payment.queue");

  await channel.bindQueue(q.queue, exchange, "order.created");

  channel.consume(q.queue, msg => {
    const order = JSON.parse(msg.content.toString());

    console.log("Processing payment:", order.id);

    const event = {
      ...order,
      status: "PAID"
    };

    channel.publish(
      exchange,
      "payment.completed",
      Buffer.from(JSON.stringify(event))
    );

    channel.ack(msg);
  });
})();