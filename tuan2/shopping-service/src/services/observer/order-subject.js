class OrderSubject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(order) {
    this.observers.forEach(obs => obs.update(order));
  }
}

module.exports = OrderSubject;
