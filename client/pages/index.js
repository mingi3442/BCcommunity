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
    });
  }, []);
  const onClick = () => {
    axios
      .post("http://localhost:8000/sendtoken", {
        username: userInfo.username,
        address: userInfo.address,
        privateKey: userInfo.privateKey,
        reciptUser: "server",
        reciptAddress: "0x616aE0a72ce2396F551F944b923e1C8108c8BFC3",
        value: 30,
      })
      .then((res) => {
        console.log(res);
      });
  };
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
