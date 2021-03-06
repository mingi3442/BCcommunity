import Link from "next/link";
import React from "react";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/router";
import { Button, Form, Grid, Header, Image, Message, Segment } from "semantic-ui-react";

// interface IInput {
//   userId?: string;
//   username?: string;
//   password?: string;
// }
// interface IResult {
//   result: number;
// }

export default function SignUp() {
  const router = useRouter();
  // const [userId, setUserId] = useState<IInput>();
  // const [username, setUsername] = useState<IInput>();
  // const [password, setPassword] = useState<IInput>();
  // const [result, setResult] = useState<IResult>();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(0);

  const onClick = async () => {
    await axios
      .post("http://localhost:8000/user/signup", {
        username,
        userId,
        password,
      })
      .then((res) => {
        console.log(res);
        if (res.data.message === "OK") {
          setResult(1);
        } else {
          setResult(2);
        }
      })
      .catch((err) => {
        if (err.response) console.log(err.response.data);
      });
  };
  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="grey" textAlign="center">
          <Image src="/logo.png" /> Blockmunity 회원가입
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
                setUserId(e.target.value);
              }}
            />
            <Form.Input
              fluid
              icon="user circle"
              iconPosition="left"
              name="username"
              placeholder="username"
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
                setPassword(e.target.value);
              }}
            />

            <Button onClick={onClick} primary fluid size="large">
              회원 가입
            </Button>
          </Segment>
        </Form>

        <div style={{ marginTop: "22px" }}>
          <Link href="/login">
            <Button content="로그인" fluid size="big" />
          </Link>
        </div>
        {result === 0 ? (
          ""
        ) : result === 1 ? (
          <Message success header="회원 가입 완료!" content="로그인 버튼을 통해 로그인창으로 이동 가능합니다" />
        ) : result === 2 ? (
          <Message error header="이미 존재하는 회원 ID입니다" />
        ) : (
          ""
        )}
      </Grid.Column>
    </Grid>
  );
}
