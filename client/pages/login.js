import Link from "next/link";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import Login from "../src/components/login";

export default function login({ setUserInfo, userInfo }) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const onClick = async () => {
    // e.preventDefault();
    await axios
      .post("http://localhost:8000/login", {
        username: username,
        pw: pw,
      })
      .then((res) => {
        setUserInfo(res.data.user);
        axios.post("./api/login").then((res) => {
          if (res.status === 200) {
            //로그인 성공
            router.push("/");
          } else {
            //로그인 실패
          }
        });
        // console.log("userInfo: ", userInfo);
      })
      .catch((err) => {
        if (err) {
          console.log("aa");
        }
      });
  };
  return <Login setUserInfo={setUserInfo} userInfo={userInfo} />;
}

// export default LoginForm;
