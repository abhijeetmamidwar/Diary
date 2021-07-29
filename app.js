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