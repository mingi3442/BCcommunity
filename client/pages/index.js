import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import axios from "axios";
import { useEffect } from "react";

export default function Home({ setIsLogin, setUserInfo }) {
  useEffect(() => {
    axios.get("http://localhost:8000/getdata").then((res) => {
      console.log(res.data);
    });
  }, []);
  const onClick = () => {
    axios.get("http://localhost:8000/getdata").then((res) => {
      console.log(res.data);
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
      <button onClick={onClick} />
      <button onClick={logout}>LOG OUT</button>
    </>
  );
}
