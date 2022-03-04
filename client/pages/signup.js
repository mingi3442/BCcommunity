import Link from "next/link";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";
import SignUp from "../src/components/SignUp";

export default function signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [result, setResult] = useState(0);
  // console.log(title, date);
  const onClick = async () => {
    await axios
      .post("http://localhost:8000/signup", {
        username: username,
        pw: pw,
      })
      .then((res) => {
        if (res.data.message === "OK") {
          setResult(1);
        } else {
          setResult(2);
        }
      });
  };
  return <SignUp />;
}
