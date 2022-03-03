import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useEffect } from "react";
import { Button } from "semantic-ui-react";

export default function Home({ userInfo, setIsLogin, setUserInfo }) {
  useEffect(() => {
    axios.get("http://localhost:8000/getdata").then((res) => {
      console.log(res.data);
      console.log(userInfo);
    });
  }, []);
  const onClick = () => {
    // console.log(userInfo);
    axios
      .post("http://localhost:8000/create", {
        userId: userInfo._id,
        username: userInfo.username,
        address: userInfo.address,
        privateKey: userInfo.privateKey,
        imgUri: "https://media.vlpt.us/images/moment_log/post/1705d3c4-afe6-41d2-a301-6a3aff9bd7cb/smartContract.jpeg?w=768",
        erc20: userInfo.erc20,
        // reciptUser: "server",
        title: "WOW",
        desc: "LOL!!",
        // reciptAddress: "0x616aE0a72ce2396F551F944b923e1C8108c8BFC3",
        value: 30,
      })
      .then((res) => {
        console.log(res);
      });
  };
  // const onClick1 = () => {
  //   axios.get("http://localhost:8000/getdata").then((res) => {
  //     console.log(res.data);
  //   });
  // };
  const ethFaucet = () => {
    axios
      .post("http://localhost:8000/ethFaucet", {
        username: userInfo.username,
        address: userInfo.address,
      })
      .then((res) => {
        console.log(res);
      });
  };
  const logout = () => {
    axios.get("./api/logout").then((res) => {
      if (res.status === 200) {
        console.log("logout!!");
      }
    });
    setIsLogin(false);
    setUserInfo({});
  };
  return (
    <>
      <Button onClick={onClick}>TEST</Button>
      <Button onClick={ethFaucet}>ethFaucet</Button>
      <button onClick={logout}>LOG OUT</button>
    </>
  );
}
