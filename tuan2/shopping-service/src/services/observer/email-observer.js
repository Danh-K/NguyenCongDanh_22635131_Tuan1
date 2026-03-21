class EmailObserver {
  update(order) {
    console.log(`Send EMAIL: Order ${order._id} paid`);
  }
}

module.exports = EmailObserver;
