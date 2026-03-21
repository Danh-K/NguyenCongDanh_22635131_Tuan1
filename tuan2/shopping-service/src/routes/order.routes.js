const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

router.post("/", controller.createOrder);
router.post("/:id/pay", controller.payOrder);

module.exports = router;
