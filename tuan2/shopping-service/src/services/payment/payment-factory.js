const MomoPayment = require("./momo-payment");
const CreditCardPayment = require("./credit-card-payment");

class PaymentFactory {
  static create(type) {
    switch (type) {
      case "MOMO":
        return new MomoPayment();
      case "CARD":
        return new CreditCardPayment();
      default:
        throw new Error("Unsupported payment method");
    }
  }
}

module.exports = PaymentFactory;
