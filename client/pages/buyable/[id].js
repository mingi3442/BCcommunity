import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, Icon, Message } from "semantic-ui-react";
import styles from "../../styles/nfts.module.css";

const Post = ({ userInfo }) => {
  const [token, setToken] = useState([]);
  console.log(token);
  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  useEffect(() => {
    axios
      .post("http://localhost:8000/nft", {
        tokenId: id,
      })
      .then((res) => {
        setToken(res.data[0]);
      });
  }, [id]);

  const buynft = () => {
    axios
      .post("http://localhost:8000/buynft", {
        buyerId: userInfo._id,
        buyerUserName: userInfo.username,
        price: token.price,
        buyer: userInfo.address,
        buyerPk: userInfo.privateKey,
        ownerAddress: token.ownerAddress,
        ownerName: token.ownerName,
        ownerId: token.ownerId,
        tokenId: id,
      })
      .then((res) => {
        console.log("구매 완료!");
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
        <div className={styles.tokenTransferContainer} style={{ height: "70%" }}>
          <h1>NFT 정보</h1>
          <Divider />

          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>NFT ID</p>
            <p className={styles.contentValue}>{token._id}</p>

            <p className={styles.contentFont}>NFT Owner</p>
            <p className={styles.contentValue}>{token.ownerName}</p>

            {token.buyable == "ok" ? (
              <div>
                <p className={styles.contentFont}>NFT Price</p>
                <div className={styles.buyContainer}>
                  <div className={styles.contentFont}>
                    <Icon name="chain" />
                    {token.price}
                  </div>
                  <Button animated="vertical" onClick={buynft}>
                    <Button.Content hidden>구매하기</Button.Content>
                    <Button.Content visible>
                      <Icon name="shop" />
                    </Button.Content>
                  </Button>
                </div>
              </div>
            ) : (
              ""
            )}
            {token.prevOwnerId ? (
              <Message floating>
                <Message.Header>Prev Data</Message.Header>
                <span>👤 PrevOwnerName : {token.prevOwnerName} </span>
                <span>
                  <br />✓ PrevPrice : {token.prevPrice} <Icon name="chain" size="mini" />
                </span>
              </Message>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
