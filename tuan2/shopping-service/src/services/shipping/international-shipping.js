const ShippingStrategy = require("./shopping-strategy");

class InternationalShipping extends ShippingStrategy {
  calculate() {
    return 100000;
  }
}

module.exports = InternationalShipping;
