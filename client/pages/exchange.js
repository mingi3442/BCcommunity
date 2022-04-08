import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Divider, Form, Icon, Input, Label } from "semantic-ui-react";
import Nft from "../src/components/Nft";
import styles from "../styles/exchange.module.css";

export default function exchange({ setUserInfo, userInfo }) {
  const [sendErc, setSendErc] = useState("");
  const [sendUser, setSendUser] = useState("");
  const [sendError, setSendError] = useState(false);
  const [nfts, setNfts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    axios.get("http://localhost:8000/nft/explore").then((res) => {
      setNfts(res.data.nft);
    });
  }, []);
  const ethFaucet = () => {
    axios
      .post("http://localhost:8000/user/eth", {
        userId: userInfo._id,
      })
      .then((res) => {
        // console.log(res.data.user);
        // setUserInfo({ ...res.data.user });
        refresh();
      });
  };
  const sendToken = () => {
    axios
      .post(`http://localhost:8000/token/${sendUser}`, {
        userId: userInfo._id,
        value: sendErc,
      })
      .then((res) => {
        console.log(res);
        router.push("/");
      });
  };
  const refresh = () => {
    axios
      .get(`http://localhost:8000/user/${userInfo._id}`)
      .then((res) => {
        setUserInfo(res.data.user);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <p className={styles.titleFont}>EXCHAGE</p>
        <div styles={{ margin: "5px" }}>
          <span className={styles.grayFont}>BMT란 ?</span>
          <p className={styles.grayFont}>로그인, 게시물을 작성시 얻을 수 있으며 모은 BMT로는 다른유저에게 전송, NFT를 생성 및 구매 가능하다!</p>
          <span className={styles.grayFont}>eth란 ?</span>
          <p className={styles.grayFont}>0.1미만 보유시 충전창이 나타나며 활동에 필요한 기본 급액이다 </p>
        </div>
        <Divider />
        <div className={styles.topContainer}>
          <div className={styles.balanceContainer}>
            <div className={styles.balanceTop}>
              <div className={styles.titleFont}>나의 Eth</div>
              <Divider />
            </div>
            <div className={styles.balanceBottom}>
              <Label size="big">
                <Icon name="ethereum" /> {userInfo.eth}
              </Label>
              {parseFloat(userInfo.eth) < 0.1 ? (
                <Button animated="vertical" size="medium" onClick={ethFaucet}>
                  <Button.Content hidden>Faucet!</Button.Content>
                  <Button.Content visible>
                    <Icon name="arrow down" />
                  </Button.Content>
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className={styles.ercContainer}>
            <div className={styles.balanceTop}>
              <div className={styles.titleFont}>나의 BMT</div>
              <Divider />
            </div>
            <div className={styles.balanceBottom}>
              <Label size="big">
                <Icon name="chain" /> {userInfo.erc20}
              </Label>
            </div>
          </div>
          <div className={styles.sendContainer}>
            <div className={styles.balanceTop}>
              <div className={styles.titleFont}>BMT 전송하기</div>
              <Divider />
            </div>
            <div className={styles.balanceBottom}>
              <div className={styles.inputContainer}>
                <p>받을 유저</p>
                {/* <Input
                  icon="users"
                  iconPosition="left"
                  placeholder="To user"
                  onChange={(e) => {
                    setSendUser(e.target.value);
                  }}
                /> */}
                <Form.Field>
                  <Input
                    icon="users"
                    iconPosition="left"
                    placeholder="UserName"
                    onChange={(e) => {
                      setSendUser(e.target.value);
                    }}
                  />
                  {sendError ? (
                    <Label basic color="red" pointing="left">
                      check Username
                    </Label>
                  ) : (
                    ""
                  )}
                </Form.Field>
                <Divider />
              </div>
              <div className={styles.inputContainer}>
                <p>보낼 수량</p>
                <Input
                  icon="chain"
                  iconPosition="left"
                  placeholder="Amount"
                  onChange={(e) => {
                    setSendErc(e.target.value);
                  }}
                />
              </div>
              <div className={styles.sendBtn}>
                <Button onClick={sendToken} animated>
                  <Button.Content visible>Send</Button.Content>
                  <Button.Content hidden>
                    <Icon name="arrow right" />
                  </Button.Content>
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Divider />
        <p className={styles.titleFont}>NFT 둘러보기</p>
        <Nft nftList={nfts} isMine={false} />
      </div>
    </div>
  );
}
