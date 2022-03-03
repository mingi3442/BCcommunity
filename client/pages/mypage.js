import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "../styles/mypage.module.css";
import { useRouter } from "next/router";
import { Button, Card, Divider, Icon, Image, Item, Label } from "semantic-ui-react";
import Link from "next/link";
import Nft from "../src/components/Nft";

function mypage({ userInfo }) {
  const [user, setUser] = useState({});
  const [myPosts, setMyPosts] = useState([]);
  const [myNfts, setMyNfts] = useState([]);
  const router = useRouter();
  console.log(0.5 > parseFloat(user.eth));
  useEffect(() => {
    axios.get("api/islogin").then((res) => {
      if (res.status === 200 && res.data.name) {
        //로그인
        axios
          .post("http://localhost:8000/userpage", {
            username: userInfo.username,
          })
          .then((res) => {
            setUser(res.data);
          });
        axios
          .post("http://localhost:8000/getmyposts", {
            username: userInfo.username,
          })
          .then((res) => {
            console.log(res.data);
            setMyPosts(res.data);
          });
        axios
          .post("http://localhost:8000/getmynfts", {
            username: userInfo.username,
          })
          .then((res) => {
            console.log(res.data);
            setMyNfts(res.data);
          });
      } else {
        //로그인x
        router.push("/login");
      }
    });
  }, []);
  const [sendEthOk, setSendEthOk] = useState(false);
  const [sendErc20Ok, setSendErc20Ok] = useState(false);
  const clickSendeth = () => {
    setSendEthOk(!sendEthOk);
  };
  const clickSende20 = () => {
    setSendErc20Ok(!sendErc20Ok);
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.headerContainer}>
          <p className={styles.contentFont}>내 정보</p>
          <Divider />
        </div>
        <div className={styles.topContainer}>
          <div className={styles.userContainer}>
            <Card>
              <Image src="./avatar_basic.png" wrapped ui={false} />{" "}
              <Card.Content>
                <Card.Header>{userInfo.username}</Card.Header>{" "}
                {/* <Card.Meta>
                  <span className="date">Joined in 2015</span>{" "}
                </Card.Meta> */}
                <br />
                <Card.Description>{`Eth 보유량 : ${userInfo.eth == undefined ? "0" : userInfo.eth}`}</Card.Description>
                <br />
                <Card.Description>{`erc20 보유량 : ${userInfo.erc20 == undefined ? "0" : userInfo.erc20}`}</Card.Description>
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

          <div className={styles.postContainer}>
            <p className={styles.contentFont}>내 게시글</p>
            <div className={styles.mainContainer}>
              <Divider />
              <Item.Group>
                {myPosts.map((post) => {
                  return (
                    <div key={post._id}>
                      <Link href={`/post/${post._id}`}>
                        <Item key={post._id}>
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
                    </div>
                  );
                })}
              </Item.Group>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.bottomContainer}>
        <Divider />
        <Nft nftList={myNfts} />
      </div>
    </div>
  );

  // return (
  //   <div>
  //     <div style={{ paddingTop: "120px", backgroundColor: "#E5E8EB" }}></div>
  //     <div className={styles.container}>
  //       <div className={styles.topContainer}>
  //         <Card>
  //           <Image src="./avatar_basic.png" wrapped ui={false} />{" "}
  //           <Card.Content>
  //             <Card.Header>{userInfo.username}</Card.Header>{" "}
  //             <Card.Meta>
  //               <span className="date">Joined in 2015</span>{" "}
  //             </Card.Meta>
  //             <Card.Description>Matthew is a musician living in Nashville.</Card.Description>{" "}
  //           </Card.Content>{" "}
  //           <Card.Content extra>
  //             {" "}
  //             <a>
  //               <Icon name="ethereum" />
  //               {userInfo.address}{" "}
  //             </a>{" "}
  //           </Card.Content>{" "}
  //         </Card>
  //         <p className={styles.contentFont}>내 게시글</p>
  //         <div className={styles.postContainer}>
  //           <div className={styles.mainContainer}>
  //             <Divider />
  //             <Item.Group>
  //               {myPosts.map((post) => {
  //                 return (
  //                   <>
  //                     <Link href={`/post/${post._id}`}>
  //                       <Item key={post._id}>
  //                         <Item.Image size="tiny" src={post.img === "" ? `/noImage.png` : `${post.img}`} />
  //                         <Item.Content>
  //                           <Item.Header>{post.title}</Item.Header>
  //                           <Item.Meta>
  //                             <span>{post.ownerName}</span>
  //                             {/* <span className="stay">1 Month</span> */}
  //                           </Item.Meta>
  //                           <Item.Description>{post.createAt}</Item.Description>
  //                         </Item.Content>
  //                       </Item>
  //                     </Link>
  //                     <Divider />
  //                   </>
  //                 );
  //               })}
  //             </Item.Group>
  //           </div>
  //         </div>
  //       </div>
  //       <div className={styles.contentContainer}></div>
  //     </div>
  //   </div>
  // );
}

export default mypage;
