import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, Icon } from "semantic-ui-react";
import styles from "../../styles/nfts.module.css";

const Post = ({ userInfo }) => {
  const [token, setToken] = useState([]);

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
      .post("http://localhost:8000/nft", {
        price: token.price,
        buyer: userInfo.address,
        buyerPk: userInfo.privateKey,
      })
      .then((res) => {
        setToken(res.data[0]);
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
            <br />
            <p className={styles.contentFont}>NFT Owner</p>
            <p className={styles.contentValue}>{token.ownerName}</p>
            <br />
            <p className={styles.contentFont}>NFT Price</p>
            <p className={styles.contentValue}>
              <Icon name="chain" />
              {token.price}
            </p>
            {token.buyable == "1" ? (
              <>
                <p className={styles.contentFont}>Token Price</p>
                <p className={styles.contentValue}>
                  <Icon name="chain" size="mini" />
                  {token.price}
                </p>
                <Button primary content="Buy!" />
              </>
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
