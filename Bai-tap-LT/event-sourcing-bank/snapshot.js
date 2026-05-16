const { replay } = require("./account");

let snapshot = {
  state: null,
  lastIndex: 0,
};

function createSnapshot(events) {
  snapshot = {
    state: replay(events),
    lastIndex: events.length,
  };

  return snapshot;
}

function replayFromSnapshot(events) {
  if (!snapshot.state) {
    return replay(events);
  }

  const remainingEvents = events.slice(snapshot.lastIndex);
  return replay(remainingEvents, snapshot.state);
}

function getSnapshot() {
  return {
    state: snapshot.state ? { ...snapshot.state } : null,
    lastIndex: snapshot.lastIndex,
  };
}

module.exports = { createSnapshot, replayFromSnapshot, getSnapshot };
