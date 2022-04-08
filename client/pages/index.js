import styles from "../styles/main.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Divider, Grid, Header, Icon, Image, Item, Label } from "semantic-ui-react";
import Link from "next/link";
import Nft from "../src/components/Nft";

export default function Home({ isLogin, userInfo, setIsLogin, setUserInfo }) {
  const [posts, setPosts] = useState([]);
  const [nfts, setNfts] = useState([]);
  console.log(isLogin);
  useEffect(() => {
    axios.get("http://localhost:8000/nft/explore").then((res) => {
      // console.log(res);
      setNfts(res.data.nft.slice(0, 3));
    });
  }, []);
  // useEffect(() => {
  //   if (isLogin) {
  //     refresh();
  //   }
  //   axios.get("http://localhost:8000/user").then((res) => {
  //     console.log(res.data);
  //   });
  // }, []);
  useEffect(() => {
    axios.get("http://localhost:8000/post/").then((res) => {
      // console.log(res.data.posts);
      setPosts(res.data.posts.reverse().slice(0, 5));
    });
  }, []);
  // const refresh = () => {
  //   axios
  //     .post("http://localhost:8000/reload", {
  //       username: userInfo.username,
  //     })
  //     .then((res) => {
  //       setUserInfo(res.data.result);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  return (
    <Grid>
      <Grid.Row stretched>
        <Grid.Column width={4}>
          <div className={styles.contentContainer}>
            <Card>
              <Image src="./avatar_basic.png" wrapped ui={false} />{" "}
              <Card.Content>
                <Card.Header>
                  {userInfo.username == undefined ? (
                    <>
                      <Link href="/login">
                        <Label as="a">
                          <Icon name="arrow circle right" /> 로그인하러 가기
                        </Label>
                      </Link>
                      <Link href="/signup">
                        <Label as="a">
                          <Icon name="add user" /> 회원가입하러 가기
                        </Label>
                      </Link>
                    </>
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
            <Link href="/exchange">판매중인 NFT</Link>
          </div>
          <Divider />
          <Nft nftList={nfts} isMine={false} />
        </Grid.Column>
        <Grid.Column width={4}>
          <div className={styles.boardContainer}>
            <div className={styles.contentFont}>
              <Link href="/board">게시판 최신 글</Link>
            </div>
            <Divider />
            <Item.Group>
              {posts.map((post) => {
                return (
                  <>
                    <Link href={`/post/${post._id}`}>
                      <Item style={{ cursor: "pointer" }} key={post._id}>
                        <Item.Image size="tiny" src={post.img === "" ? `/noImage.png` : `${post.img}`} />
                        <Item.Content>
                          <Item.Header>{post.title}</Item.Header>
                          <Item.Meta>
                            <span>{post.ownerName}</span>
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
  );
}
