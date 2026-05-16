function buildSummary(events) {
  let balance = 0;
  let totalDeposits = 0;
  let totalWithdrawals = 0;

  for (const event of events) {
    if (event.type === "MoneyDeposited") {
      balance += event.amount;
      totalDeposits += event.amount;
    }

    if (event.type === "MoneyWithdrawn") {
      balance -= event.amount;
      totalWithdrawals += event.amount;
    }
  }

  return {
    balance,
    totalDeposits,
    totalWithdrawals,
  };
}

module.exports = { buildSummary };
