import styles from "./Nft.module.css";
import { Icon } from "semantic-ui-react";
import Link from "next/link";

function Nft({ nftList, isMine }) {
  return (
    <div className={styles.mainContainer}>
      {nftList.map((token) => {
        return (
          <Link href={isMine ? `/mynfts/${token._id}` : `/buyable/${token._id}`}>
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
                  {/* <Icon name="info circle" size="large" /> */}
                  <p className={styles.amoutFont}>
                    {token.price == 0 ? "" : token.price} <Icon name="chain" size="small" />
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
export default Nft;
