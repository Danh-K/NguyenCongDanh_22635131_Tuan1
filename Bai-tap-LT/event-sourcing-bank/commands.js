const { addEvent, getEvents } = require("./eventStore");
const { replay } = require("./account");

function createAccount() {
  const state = replay(getEvents());
  if (state.created) {
    throw new Error("Account already created");
  }

  addEvent({ type: "AccountCreated" });
}

function deposit(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Deposit amount must be > 0");
  }

  const state = replay(getEvents());
  if (!state.created) {
    throw new Error("Account is not created yet");
  }

  addEvent({ type: "MoneyDeposited", amount: value });
}

function withdraw(amount) {
  const value = Number(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error("Withdraw amount must be > 0");
  }

  const state = replay(getEvents());
  if (!state.created) {
    throw new Error("Account is not created yet");
  }

  if (state.balance < value) {
    throw new Error("Insufficient balance");
  }

  addEvent({ type: "MoneyWithdrawn", amount: value });
}

module.exports = { createAccount, deposit, withdraw };
