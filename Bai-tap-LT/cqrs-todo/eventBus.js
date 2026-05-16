const subscribers = [];

function subscribe(handler) {
  subscribers.push(handler);
}

function publish(event) {
  subscribers.forEach((handler) => handler(event));
}

module.exports = { subscribe, publish };
