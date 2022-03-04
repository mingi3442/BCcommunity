import styles from "../styles/main.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Divider, Grid, Header, Icon, Image, Item, Label } from "semantic-ui-react";
import Login from "../src/components/login";
import Link from "next/link";
import Nft from "../src/components/Nft";

export default function Home({ isLogin, userInfo, setIsLogin, setUserInfo }) {
  const [posts, setPosts] = useState([]);
  const [nfts, setNfts] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8000/explore").then((res) => {
      setNfts(res.data.slice(0, 3));
    });
  }, []);
  useEffect(() => {
    if (isLogin) {
      refresh();
    }
    axios.get("http://localhost:8000/getdata").then((res) => {
      console.log(res.data);
      console.log(userInfo);
    });
  }, []);
  useEffect(() => {
    axios.get("http://localhost:8000/getposts").then((res) => {
      console.log(res.data);
      setPosts(res.data.reverse().slice(0, 5));
    });
  }, []);
  const refresh = () => {
    axios
      .post("http://localhost:8000/reload", {
        username: userInfo.username,
      })
      .then((res) => {
        setUserInfo(res.data.result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // const onClick = () => {
  //   // console.log(userInfo);
  //   axios
  //     .post("http://localhost:8000/create", {
  //       userId: userInfo._id,
  //       username: userInfo.username,
  //       address: userInfo.address,
  //       privateKey: userInfo.privateKey,
  //       imgUri: "https://media.vlpt.us/images/moment_log/post/1705d3c4-afe6-41d2-a301-6a3aff9bd7cb/smartContract.jpeg?w=768",
  //       erc20: userInfo.erc20,
  //       // reciptUser: "server",
  //       title: "WOW",
  //       desc: "LOL!!",
  //       // reciptAddress: "0x616aE0a72ce2396F551F944b923e1C8108c8BFC3",
  //       value: 30,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };
  // // const onClick = () => {
  // //   axios.get("http://localhost:8000/getdata").then((res) => {
  // //     console.log(res.data);
  // //   });
  // // };
  // const ethFaucet = () => {
  //   axios
  //     .post("http://localhost:8000/ethFaucet", {
  //       username: userInfo.username,
  //       address: userInfo.address,
  //     })
  //     .then((res) => {
  //       console.log(res);
  //     });
  // };
  // const logout = () => {
  //   axios.get("./api/logout").then((res) => {
  //     if (res.status === 200) {
  //       console.log("logout!!");
  //     }
  //   });
  //   setIsLogin(false);
  //   setUserInfo({});
  // };
  return (
    // <div className={styles.container}>
    <Grid>
      <Grid.Row stretched>
        {/* <Grid.Column width={7}></Grid.Column> */}

        <Grid.Column width={4}>
          <div className={styles.contentContainer}>
            <Card>
              <Image src="./avatar_basic.png" wrapped ui={false} />{" "}
              <Card.Content>
                <Card.Header>
                  {userInfo.username == undefined ? (
                    <Link href="/login">
                      <Label as="a">
                        <Icon name="arrow circle right" /> 로그인하러 가기
                      </Label>
                    </Link>
                  ) : (
                    userInfo.username
                  )}
                </Card.Header>{" "}
                <br />
                <Card.Description>
                  {`Eth 보유량 : ${userInfo.eth == undefined ? "0" : userInfo.eth}`} <Icon name="ethereum" />
                </Card.Description>
                <br />
                <Card.Description>
                  {`BMT 보유량 : ${userInfo.erc20 == undefined ? "0" : userInfo.erc20}`} <Icon name="chain" />
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                {" "}
                <a style={{ fontSize: "10px" }}>
                  <Icon name="ethereum" />
                  {userInfo.address}{" "}
                </a>{" "}
              </Card.Content>{" "}
            </Card>
          </div>
          {/* <Login /> */}
        </Grid.Column>
        <Grid.Column width={12}>
          <div className={styles.container}>
            <div className={styles.mainContainer}>
              <div className={styles.mainFont}>Welcome!! 🙌🏻</div>
              <div className={styles.subFont}>Blockmunity에 오신걸 환영합니다! 🙋🏻</div>
            </div>
          </div>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={12}>
          <div style={{ marginLeft: "15px" }} className={styles.contentFont}>
            판매중인 NFT
          </div>
          <Divider />
          <Nft nftList={nfts} isMine={false} />
        </Grid.Column>
        <Grid.Column width={4}>
          <div className={styles.boardContainer}>
            <div className={styles.contentFont}>게시판 최신 글</div>
            <Divider />
            <Item.Group>
              {posts.map((post) => {
                return (
                  <>
                    <Link href={`/post/${post._id}`}>
                      <Item>
                        <Item.Image size="tiny" src={post.img === "" ? `/noImage.png` : `${post.img}`} />
                        <Item.Content>
                          <Item.Header>{post.title}</Item.Header>
                          <Item.Meta>
                            <span>{post.ownerName}</span>
                            {/* <span className="stay">1 Month</span> */}
                          </Item.Meta>
                          <Item.Description>{post.createAt}</Item.Description>
                        </Item.Content>
                      </Item>
                    </Link>
                    <Divider />
                  </>
                );
              })}
            </Item.Group>
          </div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    // </div>
  );
}
