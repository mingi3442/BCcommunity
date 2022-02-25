import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Divider, Icon } from "semantic-ui-react";
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

  return (
    <>
      <div> {id}번 board</div>
      <Divider />
      <div>{post.title}</div>
      <div>{post.desc}</div>
      <div>{post.ownerName}</div>
      <div>{post.createAt}</div>
    </>
  );
};

export default Post;
