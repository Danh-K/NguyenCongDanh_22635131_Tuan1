class SmsObserver {
  update(order) {
    console.log(`Send SMS: Order ${order._id} paid`);
  }
}

module.exports = SmsObserver;
