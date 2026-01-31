const PaymentMethod = require("./payment-method");

class MomoPayment extends PaymentMethod {
  pay(amount) {
    console.log(`Pay ${amount} via MoMo`);
    return { success: true };
  }
}

module.exports = MomoPayment;
