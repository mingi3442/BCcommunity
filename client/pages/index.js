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
      .post("http://localhost:8000/test", {
        username: userInfo.username,
        address: userInfo.address,
        privateKey: userInfo.privateKey,
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
      <button onClick={logout}>LOG OUT</button>
    </>
  );
}
