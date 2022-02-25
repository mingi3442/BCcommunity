const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const lightwallet = require("eth-lightwallet");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");

require("dotenv").config();
app.use(bodyParser.json()); // 이거 덕분에 바디에 데이터 들어감 ㅠㅠ
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET_CODE, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const MongoClient = require("mongodb").MongoClient;
let db;

MongoClient.connect(process.env.MONGODB_URL, function (err, client) {
  if (err) return console.log(err);

  db = client.db("project");
  app.listen(8000, function () {
    console.log("listening on 8000");
  });
});
app.post("/login", passport.authenticate("local", { failureMessage: true }), function (req, res) {
  user = req.session.passport.user;
  console.log(user);
  res.send({ massage: "ok", user: user });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "pw",
      session: true,
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      db.collection("users").findOne({ username: username }, function (err, result) {
        // console.log(result);
        if (err) return done(err);

        if (!result) return done(null, false, { message: "존재하지않는 아이디요" });
        if (password == result.password) {
          return done(null, result, { message: "ok" });
        } else {
          return done(null, false, { message: "비번틀렸어요" });
        }
      });
    }
  )
);
passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (username, done) {
  done(null, {});
});

app.get("/getdata", (req, res) => {
  return res.send("Responding from server!");
});
app.get("/getposts", (req, res) => {
  db.collection("posts")
    .find({})
    .toArray(function (err, result) {
      console.log(result);
      res.send(result);
    });
});
app.post("/getpost", (req, res) => {
  console.log("postid?", typeof req.body.postId);
  db.collection("posts").findOne({ _id: parseInt(req.body.postId) }, (err, result) => {
    res.send(result);
  });
  //
  //   res.send("OK");
});

app.post("/write", async (req, res) => {
  //   console.log(req.user);
  db.collection("postCounter").findOne({ name: "totalPost" }, function (err, result) {
    console.log(req.body);
    var total = result.total;
    var post = { _id: total + 1, owner: req.body.owner, ownerName: req.body.ownerName, title: req.body.title, desc: req.body.desc, createAt: new Date() };
    db.collection("posts").insertOne(post, function (err, result) {
      console.log(err);
      console.log("insert:", result);
      db.collection("postCounter").updateOne({ name: "totalPost" }, { $inc: { total: 1 } }, function (err, result) {
        if (err) {
          return console.log(err);
        }
        res.send("전송완료");
      });
    });
  });
});

app.post("/signup", async (req, res) => {
  console.log(req.body.password, req.body.mnemonic);
  let username = req.body.username;
  let password = req.body.pw;
  let mnemonic;
  let address;
  //   let createAt = new Date()

  try {
    mnemonic = lightwallet.keystore.generateRandomSeed();
    lightwallet.keystore.createVault(
      {
        password: password,
        seedPhrase: mnemonic,
        hdPathString: "m/0'/0'/0'",
      },
      function (err, ks) {
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
          ks.generateNewAddress(pwDerivedKey, 1);

          address = ks.getAddresses().toString();
          //   let keystore = ks.serialize();
          db.collection("users").findOne({ username: username }, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result == null) {
              //가입가능
              db.collection("users").insertOne({ username: username, password: password, address: address, privateKey: mnemonic });
              res.send({ message: "OK" });
            } else {
              res.send({ message: "이미 있는 ID" });
              //가입 불가능
            }
          });
        });
      }
    );
  } catch (exception) {
    console.log("NewWallet ==>>>> " + exception);
  }
});
