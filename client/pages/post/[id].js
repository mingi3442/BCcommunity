import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container, Divider, Icon, Image, Label } from "semantic-ui-react";
import styles from "../../styles/id.module.css";
// import styles from "../../styles/id.module.css";

const Post = ({ userInfo }) => {
  const [post, setPost] = useState({});
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    axios
      .post("http://localhost:8000/getpost", {
        postId: id,
      })
      .then((res) => {
        console.log(res.data);
        setPost(res.data);
      });
  }, []);
  console.log(userInfo);
  //   useEffect(async () => {
  //     const tokenContract = "";
  //     if (walletType === "eth") {
  //       tokenContract = await new web3.eth.Contract(erc721Abi, newErc721addr);
  //     } else {
  //       tokenContract = await new caver.klay.Contract(kip17Abi, newKip17addr);
  //     }
  //     const name = await tokenContract.methods.name().call();
  //     const symbol = await tokenContract.methods.symbol().call();
  //     let tokenURI = await tokenContract.methods.tokenURI(id).call();
  //     let tokenOwner = await tokenContract.methods.ownerOf(id).call();
  //     setToken({ name, symbol, id, tokenURI, tokenOwner });
  //   }, []);
  const onClickDelete = () => {
    axios
      .delete("http://localhost:8000/delete", {
        data: { postId: id },
      })
      .then(() => {
        router.push("/");
      });
  };
  return (
    <div className={styles.container}>
      <div className={styles.mainContainer}>
        <Container textAlign="justified">
          {/* <div className={styles.titleContainer}> */}
          <b className={styles.titleFont}>{post.title}</b>

          {userInfo.username == post.ownerName ? (
            <div className={styles.labelContainer}>
              <div>
                <Label size="mini" as="a" content="수정" icon="write" />
              </div>
              <div onClick={onClickDelete}>
                <Label size="mini" as="a" content="삭제" icon="delete" />
              </div>
            </div>
          ) : (
            ""
          )}

          <Divider />
          <Container textAlign="right">{post.createAt}</Container>
          <Container textAlign="right">{post.ownerName}</Container>
          {post.img == "" ? (
            ""
          ) : (
            <div style={{ marginBottom: "30px" }}>
              <Image size="medium" src={post.img} />
            </div>
          )}
          <p className={styles.contentFont}>{post.desc}</p>
        </Container>
      </div>
    </div>
  );
};

export default Post;
