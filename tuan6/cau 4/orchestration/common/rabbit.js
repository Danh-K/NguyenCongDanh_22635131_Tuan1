const amqp = require("amqplib");

async function connect() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const exchange = "food.order.orchestration.exchange";
  await channel.assertExchange(exchange, "topic", { durable: true });

  return { channel, exchange };
}

module.exports = { connect };
