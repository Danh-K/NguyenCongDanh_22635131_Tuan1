const ShippingStrategy = require("./shopping-strategy");

class DomesticShipping extends ShippingStrategy {
  calculate() {
    return 30000;
  }
}

module.exports = DomesticShipping;
