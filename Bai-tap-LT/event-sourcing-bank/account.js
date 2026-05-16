function initialState() {
  return {
    created: false,
    balance: 0,
  };
}

function applyEvent(state, event) {
  switch (event.type) {
    case "AccountCreated":
      return {
        ...state,
        created: true,
        balance: 0,
      };
    case "MoneyDeposited":
      return {
        ...state,
        balance: state.balance + event.amount,
      };
    case "MoneyWithdrawn":
      return {
        ...state,
        balance: state.balance - event.amount,
      };
    default:
      return state;
  }
}

function replay(events, baseState = initialState()) {
  let state = { ...baseState };
  for (const event of events) {
    state = applyEvent(state, event);
  }
  return state;
}

function getStateAt(count, events) {
  const safeCount = Math.max(0, Math.min(count, events.length));
  return replay(events.slice(0, safeCount));
}

module.exports = { applyEvent, replay, getStateAt, initialState };
