import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "../../styles/nfts.module.css";
import { Button, Divider, Icon, Input, Label } from "semantic-ui-react";
import axios from "axios";

const Post = ({ userInfo }) => {
  console.log(userInfo);
  const [token, setToken] = useState([]);
  const [to, setTo] = useState("");
  const [price, setPrice] = useState("");
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
        ownerAddress: userInfo.address,
        ownerPK: userInfo.privateKey,
        tokenId: id,
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
  const saleNft = () => {
    axios
      .post("http://localhost:8000/saleNft", {
        tokenId: id,
        ownerAddress: userInfo.address,
        ownerPK: userInfo.privateKey,
        price: price,
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
          <h1>NFT 정보</h1>
          <Divider />
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>NFT ID</p>
            <p style={{ fontSize: "24px" }}>{token._id}</p>
            <p className={styles.contentFont}>Owner </p>
            <p className={styles.contentValue}>{token.ownerName}</p>
            <p>전송하기</p>
            <div className={styles.btnContainer}>
              <Input
                placeholder="User Name"
                size="medium"
                value={to}
                onChange={(e) => {
                  setTo(e.target.value);
                }}
              />
              <Button content="전송하기" icon="right arrow" size="medium" labelPosition="right" onClick={sendNft} />
            </div>
            <p>판매하기</p>
            <div className={styles.btnContainer}>
              <Input
                icon="chain"
                iconPosition="right"
                placeholder="Price"
                size="medium"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
              <Button content="판매등록 " size="medium" onClick={saleNft} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
