const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

var accountSchema = new mongoose.Schema({
  owner: String,
  password: String,
  username: String,

  movements: [
    {
      amount: Number,
      date: String,
    },
  ],

  monthlyMovements: [
    {
      date: [
        {
          amount: Number,
          date: String,
        },
      ],
      monthAndYear: String,
    },
  ],

  loans: [
    {
      from: String,
      amount: Number,
      date: String,
    },
  ],

  interestRate: Number,
  balance: Number,
  summary: {
    income: Number,
    expenditure: Number,
    interest: Number,
  },
});

accountSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Account", accountSchema);
