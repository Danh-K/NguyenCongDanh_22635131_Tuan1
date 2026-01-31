class ShippingStrategy {
  calculate() {
    throw new Error("calculate() must be implemented");
  }
}

module.exports = ShippingStrategy;
