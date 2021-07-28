const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");

const passport = require("passport");
const expressSession = require("express-session");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");

const Account = require("./public/account");
const activity = require("./public/function");