const { connect } = require("../common/rabbit");

(async () => {
  const { channel, exchange } = await connect();

  const orchestratorQueue = await channel.assertQueue("orchestrator.queue", {
    durable: true
  });

  await channel.bindQueue(orchestratorQueue.queue, exchange, "order.created");
  await channel.bindQueue(orchestratorQueue.queue, exchange, "payment.completed");
  await channel.bindQueue(orchestratorQueue.queue, exchange, "restaurant.prepared");
  await channel.bindQueue(orchestratorQueue.queue, exchange, "delivery.completed");

  channel.consume(orchestratorQueue.queue, msg => {
    const payload = JSON.parse(msg.content.toString());
    const routingKey = msg.fields.routingKey;

    if (routingKey === "order.created") {
      console.log(`[Orchestrator] Order received: ${payload.id}`);
      channel.publish(
        exchange,
        "payment.process",
        Buffer.from(JSON.stringify({ ...payload, status: "AWAITING_PAYMENT" }))
      );
    }

    if (routingKey === "payment.completed") {
      console.log(`[Orchestrator] Payment completed: ${payload.id}`);
      channel.publish(
        exchange,
        "restaurant.prepare",
        Buffer.from(JSON.stringify({ ...payload, status: "PAID" }))
      );
    }

    if (routingKey === "restaurant.prepared") {
      console.log(`[Orchestrator] Food prepared: ${payload.id}`);
      channel.publish(
        exchange,
        "delivery.dispatch",
        Buffer.from(JSON.stringify({ ...payload, status: "PREPARED" }))
      );
    }

    if (routingKey === "delivery.completed") {
      console.log(`[Orchestrator] Order delivered: ${payload.id}`);
      channel.publish(
        exchange,
        "order.completed",
        Buffer.from(JSON.stringify({ ...payload, status: "DELIVERED" }))
      );
    }

    channel.ack(msg);
  });

  console.log("Orchestrator service running");
})();
