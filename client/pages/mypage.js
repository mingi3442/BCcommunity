import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../styles/mypage.module.css";
import { useRouter } from "next/router";

function mypage({ userInfo }) {
  const router = useRouter();
  useEffect(() => {
    axios.get("api/islogin").then((res) => {
      if (res.status === 200 && res.data.name) {
        //로그인
      } else {
        //로그인x
        router.push("/login");
      }
    });
  }, []);
  const [sendEthOk, setSendEthOk] = useState(false);
  const [sendErc20Ok, setSendErc20Ok] = useState(false);
  const [sendErc721Ok, setSendErc721Ok] = useState(false);
  const clickSendeth = () => {
    setSendEthOk(!sendEthOk);
  };
  const clickSende20 = () => {
    setSendErc20Ok(!sendErc20Ok);
  };
  const clickSende721 = () => {
    setSendErc721Ok(!sendErc721Ok);
  };
  return (
    <div>
      <div style={{ paddingTop: "120px", backgroundColor: "#E5E8EB" }}></div>
      <div className={styles.container}>
        <div className={styles.topContainer}>
          <div className={styles.userContainer}>
            <p className={styles.nameFont}>{userInfo.username}</p>
            <label>{userInfo.address}</label>
          </div>
          <div className={styles.BalanceContainer}>
            <p className={styles.contentFont}>My Balance</p>
            <div className={styles.bncContainer}>
              <div className={styles.bnc}>
                <div style={{ width: "8em" }}>
                  <span style={{ fontSize: "22px" }}>Ether </span>
                </div>{" "}
                <p> 1.562 eth</p>
                <div></div>{" "}
                <div className={styles.sendContainer}>
                  {!sendEthOk ? (
                    <button className={styles.btn} onClick={clickSendeth}>
                      send To?
                    </button>
                  ) : (
                    <>
                      <input className={styles.ipt} placeholder="Account Address" />
                      <button className={styles.btn}>Send</button>
                      <button onClick={clickSendeth} className={styles.btnCancel}>
                        X
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.bnc}>
                <div style={{ width: "8em" }}>
                  <span style={{ fontSize: "22px" }}>ERC-20 </span>
                </div>{" "}
                <p> 1.562 eth</p>
                <div></div>{" "}
                <div className={styles.sendContainer}>
                  {!sendErc20Ok ? (
                    <button className={styles.btn} onClick={clickSende20}>
                      send To?
                    </button>
                  ) : (
                    <>
                      <input className={styles.ipt} placeholder="Account Address" />
                      <button className={styles.btn}>Send</button>
                      <button onClick={clickSende20} className={styles.btnCancel}>
                        X
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className={styles.bnc}>
                <div style={{ width: "8em" }}>
                  <span style={{ fontSize: "22px" }}>ERC-721 </span>
                </div>{" "}
                <p> 1.562 eth</p>
                <div></div>{" "}
                <div className={styles.sendContainer}>
                  {!sendErc721Ok ? (
                    <button className={styles.btn} onClick={clickSende721}>
                      send To?
                    </button>
                  ) : (
                    <>
                      <input className={styles.ipt} placeholder="Account Address" />
                      <button className={styles.btn}>Send</button>
                      <button onClick={clickSende721} className={styles.btnCancel}>
                        X
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.contentContainer}>
            <div className={styles.videoContainer}>
              <p className={styles.contentFont}>내 게시글</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default mypage;
