const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const passport = require("passport");
const expressSession = require("express-session");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const Account = require("./public/account");
const activity = require("./public/function");

const app = express();
app.set("view engine", "ejs");
app.use(
  bodyparser.urlencoded({
    extended: true,
  })
);
app.use("/public", express.static("public"));

app.use(
  expressSession({
    secret: "ThisprojectisjustforpracticeofnodeexpressandmongoDB",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

mongoose.connect("mongodb://localhost:27017/diaryDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//////////////////////////////////////////////////////////////////////////////

const monthly = function (acc) {
  const year =
    new Date().getMonth() + 1 == 1
      ? new Date().getFullYear() - 1
      : new Date().getFullYear();

  const moves = acc.movements.filter((mov) => {
    return new Date(mov.date).getMonth() + 1 == new Date().getMonth();
  });

  if (moves.length != 0) {
    acc.monthlyMovements.push({
      date: moves,
      monthAndYear: `${new Date().getMonth()}/${year}`,
    });

    moves.forEach((mov) => {
      const I = acc.movements.indexOf(mov);
      acc.movements.splice(I, 1);
    });
  }
  acc.save();
};

setInterval(function () {
  if (new Date().getDate() == 1) {
    Account.find({}, function (allFunctions) {
      allFunctions.map((acc) => monthly(acc));
    });
  }
}, 8.64e7);

//////////////////////////////////////////////////////////////////////////////

//////////////////////////
///      ROUTES
//////////////////////////

var currentAccount;

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/register", function (req, res) {
  const fullname = req.body.registerfullname;
  const username = req.body.username;
  const password = req.body.password;

  var newAccount = new Account({
    owner: fullname,
    username: username,
    interestRate: 1.1,
  });

  Account.register(newAccount, password, function (err, createdAccount) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      currentAccount = createdAccount;
      passport.authenticate("local")(req, res, function () {
        res.render("combo.ejs", { acc: currentAccount });
      });
    }
  });

  //// Normal Create model in MongoDB DataBase
  // Account.create(
  //   { owner: fullname, username: username, password: password },
  //   function (err, createdAccount) {
  //     if (!err) {
  //       currentAccount = createdAccount;
  //       console.log(currentAccount);
  //       res.render("combo.ejs", { acc: currentAccount });
  //     } else {
  //       console.log(err);
  //     }
  //   }
  // );
});

app.post("/login", function (req, res) {
  const data = new Account({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(data, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        currentAccount = req.user;
        res.render("combo.ejs", { acc: currentAccount });
      });
    }
  });

  //// Normal logging In model in MongoDB DataBase
  // Account.findOne({ username: username }, function (err, foundAccount) {
  //   if (!err && foundAccount != {}) {
  //     currentAccount = foundAccount;
  //     res.render("combo.ejs", { acc: currentAccount });
  //   } else {
  //     console.log(err);
  //   }
  // });
});

app.post("/movement", function (req, res) {
  const amount = Number(req.body.inputTransferAmount);

  if (amount > 0 && currentAccount.balance >= amount) {
    // Updating Movements
    activity.movements(currentAccount, -amount);

    // Updating balance
    activity.balance(currentAccount);

    // Updating Summary
    activity.summary(currentAccount);
  }

  let receiverAccount;

  Account.findOne(
    { username: req.body.inputTransferTo },
    function (err, foundAccount) {
      if (!err) {
        receiverAccount = foundAccount;
      } else {
        console.log(err);
      }
    }
  );

  if (
    receiverAccount &&
    receiverAccount?.username !== currentAccount.username
  ) {
    // Updating Movements
    activity.movements(receiverAccount, amount);

    // Updating balance
    activity.balance(receiverAccount);

    // Updating Summary
    activity.summary(receiverAccount);

    // Save for receiverAccount
    receiverAccount.save();
    receiverAccount = null;
  }

  currentAccount.save();

  res.render("combo.ejs", { acc: currentAccount });
});

app.post("/loan", function (req, res) {
  const amount = Number(req.body.inputLoanAmount);
  const loanFrom = req.body.inputLoanFrom;

  // Updating Movements
  activity.movements(currentAccount, amount);

  // Updating Summary
  activity.summary(currentAccount);

  // Updating balance
  activity.balance(currentAccount);

  // Updating Loan
  if (!loanFrom.toLowerCase().includes("bank")) {
    activity.loan(currentAccount, loanFrom, amount);
  }

  currentAccount.save();
  res.render("combo.ejs", { acc: currentAccount });
});