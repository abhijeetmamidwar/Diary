function summary(acc) {
  acc.summary.income = acc.movements
    .filter((mov) => mov.amount > 0)
    .reduce((accu, mov) => accu + mov.amount, 0);

  acc.summary.expenditure = Math.abs(
    acc.movements
      .filter((mov) => mov.amount < 0)
      .reduce((accu, mov) => accu + mov.amount, 0)
  );

  acc.summary.interest = acc.movements
    .filter((mov) => mov.amount > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((accu, int) => accu + int, 0);
}

function movements(acc, amount) {
  const date = new Date().toISOString().slice(0, -1);
  acc.movements.push({ amount: amount, date: date });
}

function balance(acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amount, 0);
}

function loan(acc, from, amount) {
  acc.loans.push({
    from: from,
    amount: amount,
    date: new Date().toISOString().slice(0, -1),
  });
}

module.exports = { summary, movements, balance, loan };

// const summary = function (acc) {
//   acc.summary.income = acc.movements
//     .filter((mov) => mov.amount > 0)
//     .reduce((accu, mov) => accu + mov.amount, 0);

//   acc.summary.expenditure = Math.abs(
//     acc.movements
//       .filter((mov) => mov.amount < 0)
//       .reduce((accu, mov) => accu + mov.amount, 0)
//   );

//   acc.summary.interest = acc.movements
//     .filter((mov) => mov.amount > 0)
//     .map((deposit) => (deposit * acc.interestRate) / 100)
//     .filter((int, i, arr) => int >= 1)
//     .reduce((accu, int) => accu + int, 0);
// };

// const movements = function (acc, amount) {
//   acc.movements.push({ amount: amount, date: String(new Date()) });
// };

// const balance = function (acc) {
//   acc.balance = acc.movements.reduce((acc, mov) => acc + mov.amount, 0);
// };

// const loan = function (acc, from, amount) {
//   acc.loans.push({ from: from, amount: amount, date: String(new Date()) });
// };
