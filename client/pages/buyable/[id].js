import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Divider, Icon } from "semantic-ui-react";
import styles from "../../styles/buyableId.module.css";

const Post = () => {
  const [token, setToken] = useState([]);

  const router = useRouter();
  const { id } = router.query;
  console.log(id);
  useEffect(() => {
    axios
      .post("http://localhost:8000/buyable", {
        tokenId: id,
      })
      .then((res) => {
        setToken(res.data[0]);
      });
  }, [id]);

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
          <h1>Token Info</h1>
          <Divider />
          <br />
          <div className={styles.contentContainer}>
            <p className={styles.contentFont}>Token ID</p>
            <p style={{ fontSize: "28px" }}>{token._id}</p>
            <br />
            <br />
            <p className={styles.contentFont}>Token Owner</p>
            <p className={styles.contentValue}>{token.ownerName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
