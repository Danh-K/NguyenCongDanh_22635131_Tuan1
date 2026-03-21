const orderService = require("../services/order.service");

exports.createOrder = async (req, res) => {
  const order = await orderService.createOrder(req.body);
  res.json(order);
};

exports.payOrder = async (req, res) => {
  const order = await orderService.payOrder(
    req.params.id,
    req.body.paymentType
  );
  res.json(order);
};
