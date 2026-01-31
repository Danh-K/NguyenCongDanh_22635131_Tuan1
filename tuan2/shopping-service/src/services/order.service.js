const Order = require("./models/order");
const PaymentFactory = require("./payment/payment-factory");
const DomesticShipping = require("./shipping/domestic-shopping");
const InternationalShipping = require("./shipping/international-shipping");

const OrderSubject = require("./observer/order-subject");
const EmailObserver = require("./observer/email-observer");
const SmsObserver = require("./observer/sms-observer");

class OrderService {
  async createOrder(data) {
    const shippingStrategy =
      data.shippingType === "INT"
        ? new InternationalShipping()
        : new DomesticShipping();

    const shippingFee = shippingStrategy.calculate();

    const order = await Order.create({
      ...data,
      shippingFee
    });

    return order;
  }

  async payOrder(orderId, paymentType) {
    const order = await Order.findById(orderId);

    const payment = PaymentFactory.create(paymentType);
    payment.pay(order.totalPrice);

    order.status = "PAID";
    await order.save();

    const subject = new OrderSubject();
    subject.subscribe(new EmailObserver());
    subject.subscribe(new SmsObserver());

    subject.notify(order);

    return order;
  }
}

module.exports = new OrderService();
