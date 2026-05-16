const events = [];

function addEvent(event) {
  events.push({ ...event, at: new Date().toISOString() });
}

function getEvents() {
  return [...events];
}

module.exports = { addEvent, getEvents };
