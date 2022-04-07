const express = require("express");
const mongoose = require("mongoose");
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
const bcrypt = require("bcrypt");
const erc20byteCode = require("./erc20ByteCode");
const erc721byteCode = require("./erc721ByteCode");
const web3 = new Web3("HTTP://127.0.0.1:7545");
const erc20Addr = process.env.ERC20ADDR;
const erc721Addr = process.env.ERC721ADDR;
// const server = process.env.TOKEN_ADDRESS;
// const serverPK = process.env.TOKEN_PRIVATEKEY;
var Contract = require("web3-eth-contract");
const { userRouter, postRouter, tokenRouter } = require("./routes");

require("dotenv").config();

app.use(bodyParser.json()); // 이거 덕분에 바디에 데이터 들어감 ㅠㅠ
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET_CODE, resave: true, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
// app.use("/", userRouter);
// const MongoClient = require("mongodb").MongoClient;
// let db;
// const timestamp = () => {
//   var today = new Date();
//   today.setHours(today.getHours() + 9);
//   return today.toISOString().replace("T", " ").substring(0, 19);
// };

// const serveToken = async (receiptAccount, value) => {
//   Contract.setProvider("HTTP://127.0.0.1:7545");
//   const sender = process.env.TOKEN_ADDRESS;
//   const senderPK = process.env.TOKEN_PRIVATEKEY;
//   var contractABI = erc20Abi;
//   var contract = await new Contract(contractABI, process.env.ERC20ADDR);

//   // const nonce = await web3.eth.getTransactionCount(sender, "latest");
//   // console.log(nonce);

//   const txData = contract.methods.transfer(receiptAccount, value).encodeABI();
//   const rawTransaction = {
//     to: process.env.ERC20ADDR,
//     gas: 100000,
//     data: txData,
//   };
//   web3.eth.accounts
//     .signTransaction(rawTransaction, senderPK)
//     .then(async (signedTx) => {
//       web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
//         if (!err) {
//           await contract.methods
//             .balanceOf(receiptAccount)
//             .call()
//             .then((balance) => {
//               console.log(receiptAccount + " Token Balance: " + balance);
//               db.collection("users").updateOne({ address: receiptAccount }, { $set: { erc20: parseInt(balance) } }, () => {
//                 console.log("업데이트 완료");
//               });
//             });
//         } else {
//           console.log("실패");
//         }
//       });
//     })
//     .catch((err) => {
//       console.log(err);
//       return false;
//     });
// };

// MongoClient.connect(process.env.MONGODB_URL, function (err, client) {
//   if (err) return console.log(err);
//   db = client.db("project");
//   app.use("/user", userRouter);
//   app.listen(8000, async () => {
//     console.log("listening on 8000");
//   });
// });

// app.post("/login", passport.authenticate("local", { failureMessage: true }), function (req, res) {
//   user = req.session.passport.user;
//   serveToken(user.address, 30);
//   res.send({ massage: "ok", user: user });
// });
// app.post("/reload", (req, res) => {
//   const username = req.body.username;
//   db.collection("users").findOne({ username: username }, (err, result) => {
//     res.send({ result });
//   });
// });

// passport.use(
//   new LocalStrategy(
//     {
//       usernameField: "username",
//       passwordField: "pw",
//       session: true,
//       passReqToCallback: true,
//     },
//     function (req, username, password, done) {
//       db.collection("users").findOne({ username: username }, function (err, result) {
//         // console.log(result);
//         if (err) return done(err);

//         if (!result) return done(null, false, { message: "존재하지 않는 아이디" });
//         if (password == result.password) {
//           return done(null, result, { message: "로그인" });
//         } else {
//           return done(null, false, { message: "잘못된 비밀번호" });
//         }
//       });
//     }
//   )
// );
// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// passport.deserializeUser(function (username, done) {
//   done(null, {});
// });

// app.get("/getdata", async (req, res) => {
//   const web3 = new Web3("HTTP://127.0.0.1:7545");
//   const accounts = await web3.eth.getAccounts();
//   // console.log(accounts);
//   return res.send("Responding from server!");
// });

// app.post("/sendtoken", async (req, res) => {
//   Contract.setProvider("HTTP://127.0.0.1:7545");
//   var contractABI = erc20Abi;
//   var contract = await new Contract(contractABI, process.env.ERC20ADDR);
//   const value = req.body.value;
//   const reciptUser = req.body.reciptUser;
//   const senderAccount = req.body.address;
//   const senderPK = req.body.privateKey;
//   db.collection("users").findOne({ username: reciptUser }, async (err, result) => {
//     const reciptAddress = result.address;
//     const txData = contract.methods.transfer(reciptAddress, value).encodeABI();
//     const rawTransaction = {
//       to: process.env.ERC20ADDR,
//       gas: 100000,
//       data: txData,
//     };
//     web3.eth.accounts
//       .signTransaction(rawTransaction, senderPK)
//       .then(async (signedTx) => {
//         web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, req) => {
//           if (!err) {
//             await contract.methods
//               .balanceOf(reciptAddress)
//               .call()
//               .then((balance) => {
//                 console.log(reciptAddress + " Token Balance: " + balance);
//                 db.collection("users").updateOne({ address: reciptAddress }, { $set: { erc20: parseInt(balance) } }, () => {
//                   console.log("상대 업데이트 완료");
//                 });
//                 db.collection("users").updateOne({ address: senderAccount }, { $inc: { erc20: -1 * value } }, () => {
//                   console.log("본인 업데이트 완료");
//                 });
//               });
//           } else {
//             console.log("실패", err);
//           }
//         });
//       })
//       .catch((err) => {
//         console.log(err);
//         return false;
//       });
//   });
// });
// app.post("/create", async (req, res) => {
//   Contract.setProvider("HTTP://127.0.0.1:7545");
//   const server = process.env.TOKEN_ADDRESS;
//   const serverPK = process.env.TOKEN_PRIVATEKEY;
//   var erc20contractABI = erc20Abi;
//   var erc721contractABI = erc721Abi;
//   var erc20contract = await new Contract(erc20contractABI, process.env.ERC20ADDR);
//   var erc721contract = await new Contract(erc721contractABI, process.env.ERC721ADDR);
//   // console.log(imgUri);
//   const imgUri = req.body.imgUri;
//   const createrAddress = req.body.address;
//   const createrPK = req.body.privateKey;
//   const ownerId = req.body.userId;
//   const ownerName = req.body.username;
//   const title = req.body.title;
//   const desc = req.body.desc;
//   // const reciptAddress = req.body.reciptAddress;
//   // const nonce = await web3.eth.getTransactionCount(server, "latest");
//   const txData = erc20contract.methods.transfer(server, 200).encodeABI();
//   const rawTransaction = {
//     from: createrAddress,
//     to: process.env.ERC20ADDR,
//     gas: 100000,
//     data: txData,
//   };
//   web3.eth.accounts.signTransaction(rawTransaction, createrPK).then(async (signTx) => {
//     web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//       if (!err) {
//         db.collection("users").updateOne({ address: createrAddress }, { $inc: { erc20: -200 } }, (err, result) => {
//           console.log("토큰 사용 완료");
//           if (err) {
//             console.log("토큰 감소 오류;;;");
//           } else {
//             const nftData = erc721contract.methods.mintNFT(createrAddress, imgUri).encodeABI();
//             const rawTransaction = {
//               from: server,
//               to: process.env.ERC721ADDR,
//               gas: 5000000,
//               data: nftData,
//             };
//             web3.eth.accounts.signTransaction(rawTransaction, serverPK).then((signTx) => {
//               web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//                 if (err) {
//                   console.log("민팅 실패?;;;");
//                 } else {
//                   db.collection("nftCounter").findOne({ name: "lastNftId" }, (err, result) => {
//                     var nftId = result.nftId;
//                     var token = {
//                       _id: nftId,
//                       ownerId: ownerId,
//                       ownerName: ownerName,
//                       ownerAddress: createrAddress,
//                       title: title,
//                       desc: desc,
//                       img: imgUri,
//                       buyable: "No",
//                       price: 0,
//                       prevOwnerName: "",
//                       prevOwnerId: "",
//                       createAt: timestamp(),
//                     };
//                     db.collection("nfts").insertOne(token, (err, result) => {
//                       console.log(err);

//                       db.collection("nftCounter").updateOne({ name: "lastNftId" }, { $inc: { nftId: 1 } }, (err, result) => {
//                         if (err) {
//                           console.log(err);
//                         } else {
//                           res.json({ message: "생성 완료!" });
//                         }
//                       });
//                     });
//                   });
//                 }
//               });
//             });
//           }
//         });
//       } else {
//         console.log(err);
//         res.json({ message: "토큰 부족" });
//       }
//     });
//   });
// });
// app.post("/ethFaucet", async (req, res) => {
//   const sendAccount = process.env.GANACHE_ADDRESS;
//   const privateKey = process.env.GANACHE_PRIVATEKEY;
//   const receiptAccount = req.body.address;

//   const tx = {
//     from: sendAccount,
//     to: receiptAccount,
//     gas: 500000,
//     value: web3.utils.toWei("0.1", "ether"),
//   };
//   await web3.eth.accounts.signTransaction(tx, privateKey).then((signedTx) => {
//     web3.eth.sendSignedTransaction(signedTx.rawTransaction, async (err, hash) => {
//       if (err) {
//         console.log("transaction 실패 : ", err);
//       } else {
//         const balance = await web3.eth.getBalance(receiptAccount);
//         db.collection("users").updateOne({ address: receiptAccount }, { $set: { eth: web3.utils.fromWei(balance, "ether") } });
//         res.json({
//           message: "성공",
//           data: {
//             address: receiptAccount,
//             balance: parseFloat(web3.utils.fromWei(balance, "ether")),
//             txHash: hash,
//           },
//         });
//       }
//     });
//   });
// });

// app.get("/getposts", (req, res) => {
//   db.collection("posts")
//     .find({})
//     .toArray(function (err, result) {
//       res.send(result);
//     });
// });
// app.post("/getpost", (req, res) => {
//   db.collection("posts").findOne({ _id: parseInt(req.body.postId) }, (err, result) => {
//     res.send(result);
//   });
// });
// app.post(
//   "/getmyposts",
//   (req, res) => {
//     db.collection("posts")
//       .find({ ownerName: req.body.username })
//       .toArray((err, result) => {
//         res.send(result);
//       });
//     //
//   } //   res.send("OK");
// );
// app.post(
//   "/getmynfts",
//   (req, res) => {
//     db.collection("nfts")
//       .find({ ownerName: req.body.username })
//       .toArray((err, result) => {
//         res.send(result);
//       });
//     //
//   } //   res.send("OK");
// );
// app.get("/explore", (req, res) => {
//   let nfts = [];
//   db.collection("nfts")
//     .find({ buyable: "ok" })
//     .toArray((err, result) => {
//       result.map((e) => nfts.push(e));
//       res.send(nfts);
//     });
// });
// app.post(
//   "/nft",
//   (req, res) => {
//     db.collection("nfts")
//       .find({ _id: parseInt(req.body.tokenId) })
//       .toArray((err, result) => {
//         res.send(result);
//       });
//     //
//   } //   res.send("OK");
// );
// app.get(
//   "/explore",
//   (req, res) => {
//     db.collection("nfts")
//       .find({ ownerName: "ss" })
//       .toArray((err, result) => {
//         res.send(result);
//       });
//     //
//   } //   res.send("OK");
// );
// app.post("/userpage", (req, res) => {
//   db.collection("users").findOne({ username: req.body.username }, (err, result) => {
//     res.send(result);
//   });
//   //
//   //   res.send("OK");
// });

// app.post("/addreply", async (req, res) => {
//   var reply = { postId: req.body.postId, ownerId: req.body.ownerId, ownerName: req.body.ownerName, desc: req.body.desc, createAt: timestamp() };
//   db.collection("replys").insertOne(reply, (err, result) => {
//     if (err) {
//       return console.log(err);
//     }
//     serveToken(req.body.ownerAddress, 5);
//     res.send("댓글입력 완료");
//   });
// });
// app.post("/getreply", (req, res) => {
//   db.collection("replys")
//     .find({ postId: req.body.postId })
//     .toArray((err, result) => {
//       res.send(result);
//     });
// });
// app.post("/write", async (req, res) => {
//   db.collection("postCounter").findOne({ name: "totalPost" }, function (err, result) {
//     var total = result.total;
//     var post = { _id: total + 1, owner: req.body.owner, ownerName: req.body.ownerName, title: req.body.title, desc: req.body.desc, img: req.body.img, createAt: timestamp() };
//     db.collection("posts").insertOne(post, (err, result) => {
//       if (err) {
//         console.log(err);
//       }

//       db.collection("postCounter").updateOne({ name: "totalPost" }, { $inc: { total: 1 } }, (err, result) => {
//         if (err) {
//           return console.log(err);
//         }
//         serveToken(req.body.ownerAddress, 10);
//         res.send("전송완료");
//       });
//     });
//   });
// });

// app.post("/signup", async (req, res) => {
//   let username = req.body.username;
//   let password = req.body.pw;
//   let mnemonic;
//   let address;
//   let pk;

//   try {
//     mnemonic = lightwallet.keystore.generateRandomSeed();
//     lightwallet.keystore.createVault(
//       {
//         password: password,
//         seedPhrase: mnemonic,
//         hdPathString: "m/0'/0'/0'",
//       },
//       function (err, ks) {
//         ks.keyFromPassword(password, function (err, pwDerivedKey) {
//           ks.generateNewAddress(pwDerivedKey);
//           ks.generateNewAddress(pwDerivedKey);
//           address = ks.getAddresses()[0];
//           pk = ks.exportPrivateKey(address, pwDerivedKey);
//           // address = ks.getAddresses().toString();

//           db.collection("users").findOne({ username: username }, (err, result) => {
//             if (err) {
//               console.log(err);
//             }
//             if (result == null) {
//               //가입가능
//               db.collection("users").insertOne({ username: username, password: password, address: address.toString(), privateKey: pk, mnemonic: mnemonic, erc20: 0, eth: 0 });
//               res.send({ message: "OK" });
//             } else {
//               res.send({ message: "이미 있는 ID" });
//               //가입 불가능
//             }
//           });
//         });
//       }
//     );
//   } catch (err) {
//     console.log(err);
//   }
// });
// app.delete("/delete", (req, res) => {
//   postId = parseInt(req.body.postId);

//   db.collection("posts").deleteOne({ _id: postId }, function (err, result) {
//     console.log("삭제완료");
//   });
//   res.send("삭제완료");
// });

// app.post("/sendnft", (req, res) => {
//   //sendnft
//   const server = process.env.TOKEN_ADDRESS;
//   const ownerPK = req.body.ownerPK;
//   const ownerAddress = req.body.ownerAddress;
//   const reciptUserName = req.body.reciptUserName;
//   const tokenId = req.body.tokenId;
//   db.collection("users").findOne({ address: ownerAddress }, (err, result) => {
//     if (err) {
//       console.log("전송하는 유저찾기 실패");
//     } else {
//       console.log("result1:", result);
//       var erc721contractABI = erc721Abi;
//       var erc721contract = new Contract(erc721contractABI, process.env.ERC721ADDR);
//       db.collection("users").findOne({ username: reciptUserName }, (err, result) => {
//         if (err) {
//           console.log("수신유저 찾기 실패");
//         } else {
//           const reciptAddress = result.address;
//           const reciptId = result._id;
//           console.log(reciptAddress);
//           const nftData = erc721contract.methods.transferFrom(ownerAddress, reciptAddress, parseInt(tokenId)).encodeABI();
//           const rawTransaction = {
//             from: server,
//             to: process.env.ERC721ADDR,
//             gas: 5000000,
//             data: nftData,
//           };
//           web3.eth.accounts.signTransaction(rawTransaction, ownerPK).then((signTx) => {
//             web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//               if (err) {
//                 console.log("transferFrom에러: ", err);
//               } else {
//                 db.collection("nfts").updateOne(
//                   { _id: parseInt(tokenId) },
//                   { $set: { ownerId: reciptId, ownerName: reciptUserName, ownerAddress: reciptAddress } },
//                   (err, result) => {
//                     if (err) {
//                       console.log("db수정 실패?");
//                     } else {
//                       console.log("전송 완료!");
//                       res.json({ message: "전송 완료!" });
//                     }
//                   }
//                 );
//               }
//             });
//           });
//         }
//       });
//     }
//   });
// });

// app.post("/buynft", async (req, res) => {
//   console.log(req.body);
//   Contract.setProvider("HTTP://127.0.0.1:7545");
//   var erc20contractABI = erc20Abi;
//   var erc721contractABI = erc721Abi;
//   const server = process.env.TOKEN_ADDRESS;
//   const serverPK = process.env.TOKEN_PRIVATEKEY;
//   var erc20contract = await new Contract(erc20contractABI, process.env.ERC20ADDR);
//   var erc721contract = await new Contract(erc721contractABI, process.env.ERC721ADDR);
//   const buyerAddress = req.body.buyer;
//   const price = req.body.price;
//   const buyerPk = req.body.buyerPk;
//   const ownerAddress = req.body.ownerAddress;
//   const buyerUserName = req.body.buyerUserName;
//   const ownerName = req.body.ownerName;
//   const buyerId = req.body.buyerId;
//   const tokenId = req.body.tokenId;
//   const ownerId = req.body.ownerId;
//   const txData = erc20contract.methods.transfer(ownerAddress, 200).encodeABI();
//   const rawTransaction = {
//     from: buyerAddress,
//     to: process.env.ERC20ADDR,
//     gas: 100000,
//     data: txData,
//   };
//   web3.eth.accounts.signTransaction(rawTransaction, buyerPk).then(async (signTx) => {
//     web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//       if (err) {
//         console.log("erc20 transfer 에러 : ", err);
//       } else {
//         db.collection("users").updateOne({ address: buyerAddress }, { $inc: { erc20: -parseInt(price) } }, (err, result) => {
//           console.log("토큰 사용 완료");
//           if (err) {
//             console.log("토큰 감소 오류;;;");
//           } else {
//             const nftData = erc721contract.methods.transferFrom(ownerAddress, buyerAddress, parseInt(tokenId)).encodeABI();
//             const rawTransaction = {
//               from: server,
//               to: process.env.ERC721ADDR,
//               gas: 5000000,
//               data: nftData,
//             };
//             web3.eth.accounts.signTransaction(rawTransaction, serverPK).then((signTx) => {
//               web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//                 if (err) {
//                   console.log("transferFrom에러: ", err);
//                 } else {
//                   db.collection("nfts").updateOne(
//                     { _id: parseInt(tokenId) },
//                     {
//                       $set: {
//                         ownerId: buyerId,
//                         ownerName: buyerUserName,
//                         ownerAddress: buyerAddress,
//                         buyable: "no",
//                         prevOwnerName: ownerName,
//                         prevOwnerId: ownerId,
//                         prevPrice: price,
//                         price: 0,
//                       },
//                     },
//                     (err, result) => {
//                       if (err) {
//                         console.log("db수정 실패?");
//                       } else {
//                         console.log("구매완료!!!");
//                         res.json({ message: "구매완료!!!" });
//                       }
//                     }
//                   );
//                 }
//               });
//             });
//           }
//         });
//       }
//     });
//   });
// });

// app.post("/saleNft", async (req, res) => {
//   const server = process.env.TOKEN_ADDRESS;
//   const serverPK = process.env.TOKEN_PRIVATEKEY;
//   const tokenId = req.body.tokenId;
//   const ownerAddress = req.body.ownerAddress;
//   const ownerPK = req.body.ownerPK;
//   const price = req.body.price;
//   var erc721contractABI = erc721Abi;
//   var erc721contract = new Contract(erc721contractABI, process.env.ERC721ADDR);
//   const nftData = erc721contract.methods.approve(server, parseInt(tokenId)).encodeABI();
//   const rawTransaction = {
//     from: server,
//     to: process.env.ERC721ADDR,
//     gas: 5000000,
//     data: nftData,
//   };
//   web3.eth.accounts.signTransaction(rawTransaction, ownerPK).then((signTx) => {
//     web3.eth.sendSignedTransaction(signTx.rawTransaction, async (err, req) => {
//       if (err) {
//         console.log("apporve err :", err);
//       } else {
//         db.collection("nfts").updateOne({ _id: parseInt(tokenId) }, { $set: { price: price, buyable: "ok" } }, (err, result) => {
//           if (err) {
//             console.log("db수정 에러 : ", err);
//           } else {
//             console.log("판매 등록 완료!!");
//             res.json({ message: "판매 등록 완료!!" });
//           }
//         });
//       }
//     });
//   });
// });

const server = () => {
  try {
    mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    });
    app.use("/user/", userRouter);
    app.use("/post/", postRouter);
    app.use("/token/", tokenRouter);

    app.listen(8000, async () => {
      console.log(`server listening on port 8000`);
    });
  } catch (err) {
    console.log(err);
  }
};
server();
