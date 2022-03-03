const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const lightwallet = require("eth-lightwallet");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const erc20Abi = require("./erc20Abi");
const erc721Abi = require("./erc721Abi");
const Web3 = require("web3");
const erc20byteCode = require("./erc20ByteCode");
const erc721byteCode = require("./erc721ByteCode");
const web3 = new Web3("HTTP://127.0.0.1:7545");
const erc20Addr = process.env.ERC20ADDR;
const erc721Addr = process.env.ERC721ADDR;
var Contract = require("web3-eth-contract");

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

const serveToken = async (receiptAccount, value) => {
  Contract.setProvider("HTTP://127.0.0.1:7545");
  const sender = process.env.TOKEN_ADDRESS;
  const senderPK = process.env.TOKEN_PRIVATEKEY;
  var contractABI = erc20Abi;
  var contract = await new Contract(contractABI, process.env.ERC20ADDR);

  // const nonce = await web3.eth.getTransactionCount(sender, "latest");
  // console.log(nonce);
  const txData = contract.methods.transfer(receiptAccount, value).encodeABI();
  const rawTransaction = {
    to: process.env.ERC20ADDR,
    gas: 100000,
    data: txData,
  };
  web3.eth.accounts
    .signTransaction(rawTransaction, senderPK)
    .then(async (signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
        if (!err) {
          console.log("AA");
          await contract.methods
            .balanceOf(receiptAccount)
            .call()
            .then((balance) => {
              console.log(receiptAccount + " Token Balance: " + balance);
              db.collection("users").updateOne({ address: receiptAccount }, { $set: { erc20: parseInt(balance) } }, () => {
                console.log("업데이트 완료");
              });
            });
        } else {
          console.log("실패");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

MongoClient.connect(process.env.MONGODB_URL, function (err, client) {
  if (err) return console.log(err);

  db = client.db("project");
  app.listen(8000, function () {
    console.log("listening on 8000");
  });
});
app.post("/login", passport.authenticate("local", { failureMessage: true }), function (req, res) {
  user = req.session.passport.user;
  console.log(user.address);
  serveToken(user.address, 30);
  // console.log( a);
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

        if (!result) return done(null, false, { message: "존재하지 않는 아이디" });
        if (password == result.password) {
          return done(null, result, { message: "로그인" });
        } else {
          return done(null, false, { message: "잘못된 비밀번호" });
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

app.get("/getdata", async (req, res) => {
  const web3 = new Web3("HTTP://127.0.0.1:7545");
  const accounts = await web3.eth.getAccounts();
  // console.log(accounts);
  return res.send("Responding from server!");
});

app.post("/sendtoken", async (req, res) => {
  Contract.setProvider("HTTP://127.0.0.1:7545");
  var contractABI = erc20Abi;
  var contract = await new Contract(contractABI, process.env.ERC20ADDR);
  const value = req.body.value;
  const reciptUser = req.body.reciptUser;
  const senderAccount = req.body.address;
  const senderPK = req.body.privateKey;
  db.collection("users").findOne({ username: reciptUser }, async (err, result) => {
    const reciptAddress = result.address;
    const txData = contract.methods.transfer(reciptAddress, value).encodeABI();
    const rawTransaction = {
      to: process.env.ERC20ADDR,
      gas: 100000,
      data: txData,
    };
    web3.eth.accounts
      .signTransaction(rawTransaction, senderPK)
      .then(async (signedTx) => {
        web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
          if (!err) {
            await contract.methods
              .balanceOf(reciptAddress)
              .call()
              .then((balance) => {
                console.log(reciptAddress + " Token Balance: " + balance);
                db.collection("users").updateOne({ address: reciptAddress }, { $set: { erc20: parseInt(balance) } }, () => {
                  console.log("상대 업데이트 완료");
                });
                db.collection("users").updateOne({ address: senderAccount }, { $inc: { erc20: -1 * value } }, () => {
                  console.log("본인 업데이트 완료");
                });
              });
          } else {
            console.log("실패", err);
          }
        });
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  });
});
app.post("/create", async (req, res) => {
  console.log(req.body);
  Contract.setProvider("HTTP://127.0.0.1:7545");
  const server = process.env.TOKEN_ADDRESS;
  const serverPK = process.env.TOKEN_PRIVATEKEY;
  var erc20contractABI = erc20Abi;
  var erc721contractABI = erc721Abi;
  var erc20contract = await new Contract(erc20contractABI, process.env.ERC20ADDR);
  var erc721contract = await new Contract(erc721contractABI, process.env.ERC721ADDR);
  const imgUri = req.body.imgUri;
  const createrAddress = req.body.address;
  const createrPK = req.body.privateKey;
  const ownerId = req.body.userId;
  const ownerName = req.body.username;
  const title = req.body.title;
  const desc = req.body.desc;
  // const reciptAddress = req.body.reciptAddress;
  // const nonce = await web3.eth.getTransactionCount(server, "latest");
  const txData = erc20contract.methods.transfer(server, 200).encodeABI();
  const rawTransaction = {
    from: createrAddress,
    to: process.env.ERC20ADDR,
    gas: 100000,
    data: txData,
  };
  web3.eth.accounts.signTransaction(rawTransaction, createrPK).then(async (signTx) => {
    web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
      if (!err) {
        db.collection("users").updateOne({ address: createrAddress }, { $inc: { erc20: -200 } }, (err, result) => {
          console.log("토큰 사용 완료");
          if (err) {
            console.log("토큰 감소 오류;;;");
          } else {
            const nftData = erc721contract.methods.mintNFT(createrAddress, imgUri).encodeABI();
            const rawTransaction = {
              from: server,
              to: process.env.ERC721ADDR,
              gas: 5000000,
              data: nftData,
            };
            web3.eth.accounts.signTransaction(rawTransaction, serverPK).then((signTx) => {
              web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
                if (err) {
                  console.log("민팅 실패?;;;");
                } else {
                  db.collection("nftCounter").findOne({ name: "lastNftId" }, (err, result) => {
                    var nftId = result.nftId;
                    var token = {
                      _id: nftId,
                      ownerId: ownerId,
                      ownerName: ownerName,
                      ownerAddress: createrAddress,
                      title: title,
                      desc: desc,
                      img: imgUri,
                      createAt: new Date(),
                    };
                    db.collection("nfts").insertOne(token, (err, result) => {
                      console.log(err);
                      console.log("insert:", result);
                      db.collection("nftCounter").updateOne({ name: "lastNftId" }, { $inc: { nftId: 1 } }, (err, result) => {
                        if (err) {
                          console.log(err);
                        } else {
                          console.log("생성 완료!");
                          res.json({ message: "생성 완료!" });
                        }
                      });
                    });
                  });
                }
              });
            });
          }
        });
      } else {
        console.log(err);
        res.json({ message: "토큰 부족" });
      }
    });
  });
  // web3.eth.accounts
  //   .signTransaction(rawTransaction, senderPK)
  //   .then(async (signedTx) => {
  //     web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
  //       if (!err) {
  //         txData = contract.methods.transferFrom(server, reciptAddress, value).encodeABI();
  //         rawTransaction = {
  //           to: process.env.ERC20ADDR,
  //           gas: 100000,
  //           data: txData,
  //         };
  //         web3.eth.accounts.signTransaction(rawTransaction, serverPK).then(async (signedTx) => {
  //           web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
  //             if (!err) {
  //               await contract.methods
  //                 .balanceOf(receiptAccount)
  //                 .call()
  //                 .then((balance) => {
  //                   console.log(receiptAccount + " Token Balance: " + balance);
  //                 });
  //             } else {
  //               console.log("2번 실패");
  //             }
  //           });
  //         });
  //       } else {
  //         console.log("1번 실패");
  //       }
  //     });
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //     return false;
  //   });
});
app.post("/ethFaucet", async (req, res) => {
  const sendAccount = process.env.GANACHE_ADDRESS;
  const privateKey = process.env.GANACHE_PRIVATEKEY;
  const receiptAccount = req.body.address;
  const nonce = await web3.eth.getTransactionCount(sendAccount, "latest");
  const tx = {
    from: sendAccount,
    to: receiptAccount,
    nonce: nonce,
    gas: 500000,
    value: web3.utils.toWei("0.1", "ether"),
  };
  await web3.eth.accounts
    .signTransaction(tx, privateKey)
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, hash) => {
        if (!err) {
          const balance = await web3.eth.getBalance(receiptAccount);
          db.collection("users").updateOne({ address: receiptAccount }, { $set: { eth: web3.utils.fromWei(balance, "ether") } });
          res.json({
            message: "성공",
            data: {
              userName: "test12345",
              address: receiptAccount,
              balance: parseFloat(web3.utils.fromWei(balance, "ether")),
              txHash: hash,
            },
          });
        } else {
          console.log("실패");
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.json({
        message: "실패",
      });
    });
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
app.post(
  "/getmyposts",
  (req, res) => {
    db.collection("posts")
      .find({ ownerName: req.body.username })
      .toArray((err, result) => {
        res.send(result);
      });
    //
  } //   res.send("OK");
);
app.post(
  "/getmynfts",
  (req, res) => {
    db.collection("nfts")
      .find({ ownerName: req.body.username })
      .toArray((err, result) => {
        res.send(result);
      });
    //
  } //   res.send("OK");
);
app.get(
  "/explore",
  (req, res) => {
    db.collection("nfts")
      .find({ ownerName: "ss" })
      .toArray((err, result) => {
        res.send(result);
      });
    //
  } //   res.send("OK");
);
app.post(
  "/buyable",
  (req, res) => {
    db.collection("nfts")
      .find({ _id: parseInt(req.body.tokenId) })
      .toArray((err, result) => {
        res.send(result);
      });
    //
  } //   res.send("OK");
);
app.get(
  "/explore",
  (req, res) => {
    db.collection("nfts")
      .find({ ownerName: "ss" })
      .toArray((err, result) => {
        res.send(result);
      });
    //
  } //   res.send("OK");
);
app.post("/userpage", (req, res) => {
  // console.log("postid?", typeof req.body.postId);
  db.collection("users").findOne({ username: req.body.username }, (err, result) => {
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
    var post = { _id: total + 1, owner: req.body.owner, ownerName: req.body.ownerName, title: req.body.title, desc: req.body.desc, img: req.body.img, createAt: new Date() };
    db.collection("posts").insertOne(post, function (err, result) {
      console.log(err);
      console.log("insert:", result);
      db.collection("postCounter").updateOne({ name: "totalPost" }, { $inc: { total: 1 } }, function (err, result) {
        if (err) {
          return console.log(err);
        }
        serveToken(req.body.ownerAddress, 10);
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
  let pk;
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
          ks.generateNewAddress(pwDerivedKey);
          ks.generateNewAddress(pwDerivedKey);
          address = ks.getAddresses()[0];
          pk = ks.exportPrivateKey(address, pwDerivedKey);
          // address = ks.getAddresses().toString();

          db.collection("users").findOne({ username: username }, (err, result) => {
            if (err) {
              console.log(err);
            }
            if (result == null) {
              //가입가능
              db.collection("users").insertOne({ username: username, password: password, address: address.toString(), privateKey: pk, mnemonic: mnemonic, erc20: 0, eth: 0 });
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
app.delete("/delete", (req, res) => {
  postId = parseInt(req.body.postId);
  console.log(typeof postId);
  db.collection("posts").deleteOne({ _id: postId }, function (err, result) {
    console.log("삭제완료");
  });
  res.send("삭제완료");
});
app.post("/create", async (req, res) => {});
