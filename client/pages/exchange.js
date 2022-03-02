import axios from "axios";
import { useState } from "react";
import { Button, Divider, Form, Icon, Input, Label } from "semantic-ui-react";
import styles from "../styles/exchange.module.css";

export default function exchange({ setUserInfo, userInfo }) {
  const [sendErc, setSendErc] = useState("");
  const [sendUser, setSendUser] = useState("");
  const [sendError, setSendError] = useState(false);

  const ethFaucet = () => {
    axios
      .post("http://localhost:8000/ethFaucet", {
        username: userInfo.username,
        address: userInfo.address,
      })
      .then((res) => {
        setUserInfo({ ...userInfo, eth: res.data.balance });
        console.log(userInfo);
        // console.log(res.balance);
      });
  };
  const sendToken = () => {
    axios
      .post("http://localhost:8000/sendtoken", {
        username: userInfo.username,
        address: userInfo.address,
        privateKey: userInfo.privateKey,
        reciptUser: sendUser,
        // reciptAddress: "0x616aE0a72ce2396F551F944b923e1C8108c8BFC3",
        value: sendErc,
      })
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <div className={styles.titleFont}>EXCHAGE</div>
        <p>"토큰이란 ? 토큰에대한 설명(토큰 받는 방법, 모아서 nft구매 등등.."</p>
        <p>"eth란 ? 교환하는데 필요하며 0.1 미만일 경우 무료로 발급 가능"</p>
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
              <div className={styles.titleFont}>나의 ERC20</div>
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
              <div className={styles.titleFont}>토큰 전송하기</div>
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
        {/* <div>{userInfo.eth}</div>
        <div>{userInfo.erc20}</div> */}
      </div>
    </div>
  );
}
