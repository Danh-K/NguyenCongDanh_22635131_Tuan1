const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { connect } = require("../common/rabbit");

(async () => {
  const app = express();
  app.use(express.json());

  const { channel, exchange } = await connect();

  app.post("/order", async (req, res) => {
    const order = {
      id: uuidv4(),
      items: req.body.items || [],
      status: "CREATED"
    };

    channel.publish(
      exchange,
      "order.created",
      Buffer.from(JSON.stringify(order))
    );

    res.json({
      message: "Order created and sent to orchestrator",
      order
    });
  });

  app.listen(3001, () => {
    console.log("Order service (orchestration) running on port 3001");
  });
})();
