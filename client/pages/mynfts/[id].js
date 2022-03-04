import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/nfts.module.css";
import { Button, Divider, Icon, Input } from "semantic-ui-react";
import axios from "axios";

const Post = () => {
  const [token, setToken] = useState([]);
  const [to, setTo] = useState("");
  const router = useRouter();
  const { id } = router.query;
  console.log(to);
  console.log(token);
  useEffect(async () => {
    axios
      .post("http://localhost:8000/nft", {
        tokenId: id,
      })
      .then((res) => {
        setToken(res.data[0]);
      });
  }, [id]);
  const sendNft = () => {
    axios
      .post("http://localhost:8000/sendnft", {
        tokenId: id,
        ownerAddress: token.ownerAddress,
        reciptUserName: to,
      })
      .then((res) => {
        console.log("전송 완료!");
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  };
  console.log(token.ownerAddress);
  //   const sendToken = async (tokenId) => {
  //     const tokenContract = "";
  //     if (walletType === "eth") {
  //       tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr, {
  //         from: account,
  //       });
  //       tokenContract.options.address = newErc721addr;
  //       tokenContract.methods
  //         .transferFrom(account, to, token.id)
  //         .send({
  //           from: account,
  //         })
  //         .on("receipt", (receipt) => {
  //           setTo("");
  //           router.push("/");
  //         });
  //     } else {
  //       tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr, {
  //         from: account,
  //       });
  //       tokenContract.options.address = newKip17addr;
  //       tokenContract.methods
  //         .transferFrom(account, to, token.id)
  //         .send({
  //           from: account,
  //           gas: 0xf4240, //왜 이가격인지는 모르겠습니다....
  //         })
  //         .on("receipt", (receipt) => {
  //           setTo("");
  //           router.push("/");
  //         });
  //     }
  //   };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <div key={token._id} className={styles.tokenContainer}>
            <img
              src={token.img}
              alt={token._id}
              style={{ width: "100%", height: "80%", objectFit: "cover", borderTopLeftRadius: "inherit", borderTopRightRadius: "inherit", margin: "0.1px" }}
            />
            <div className={styles.desc}>
              <div className={styles.user}>
                <Icon name="user circle" size="big" />
                <div className={styles.userText}>
                  <span>{token.title}</span>
                  <div>{token.desc}</div>
                </div>
              </div>
              <div style={{ marginRight: "20px" }}>
                <Icon name="info circle" size="large" />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.tokenTransferContainer}>
          <h1>Send</h1>
          <Divider />
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>Token ID</p>
            <p style={{ fontSize: "24px" }}>{token._id}</p>
            <p className={styles.contentFont}>
              From{" "}
              <span style={{ fontSize: "16px" }} className={styles.require}>
                *
              </span>
            </p>
            <p className={styles.contentValue}>{token.ownerName}</p>
          </div>
          <div className="tokenTransfer">
            <p className={styles.contentFont}>To</p>{" "}
            <Input
              placeholder="Account Address"
              fluid
              size="large"
              value={to}
              onChange={(e) => {
                setTo(e.target.value);
              }}
            />
          </div>
          <div className={styles.btnContainer}>
            <Button content="Send Token" icon="right arrow" size="big" labelPosition="right" onClick={sendNft} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
