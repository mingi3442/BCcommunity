import Link from "next/link";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";

export default function Login({ setUserInfo, userInfo }) {
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
        console.log(res.data.user);
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
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="grey" textAlign="center">
          <Image src="/logo.png" /> Blockmunity 로그인
        </Header>
        <Form size="large">
          <Segment stacked>
            <Form.Input
              fluid
              icon="user"
              iconPosition="left"
              name="username"
              placeholder="User ID"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="lock"
              name="pw"
              iconPosition="left"
              placeholder="Password"
              type="password"
              onChange={(e) => {
                setPw(e.target.value);
              }}
            />

            <Button onClick={onClick} primary fluid size="large">
              Login
            </Button>
          </Segment>
        </Form>

        <div style={{ marginTop: "22px" }}>
          <Link href="/signup">
            <Button content="회원 가입" fluid size="big" />
          </Link>
        </div>
      </Grid.Column>
    </Grid>
  );
}

// export default LoginForm;
