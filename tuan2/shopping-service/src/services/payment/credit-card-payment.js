const PaymentMethod = require("./payment-method");

class CreditCardPayment extends PaymentMethod {
  pay(amount) {
    console.log(`Pay ${amount} via Credit Card`);
    return { success: true };
  }
}

module.exports = CreditCardPayment;
