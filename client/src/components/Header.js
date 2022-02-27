import React, { useState, useEffect } from "react";
import { Input, Icon, Label, Menu } from "semantic-ui-react";
import styles from "./Header.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

export default function Header({ isLogin, setIsLogin, setUserInfo }) {
  const router = useRouter();
  console.log(router.pathname);
  const [activeItem, setActiveItem] = useState("");
  useEffect(() => {
    setActiveItem(router.pathname);
  }, [router.pathname]);
  const loginButton = () => {
    if (!isLogin) {
      connectWallet();
    }
    if (isLogin) {
      setAccount("");
    }
    setIsLogin(!isLogin);
    tokenSave(account);
  };
  const kaikasLoginButton = (e) => {
    if (!isLogin) {
      connectKaikas();
    }
    if (isLogin) {
      setAccount("");
    }
    setIsLogin(!isLogin);
    tokenSave(account);
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
      <Link href="/">
        <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <img src="/logo.png" alt="logo" style={{ display: "flex", width: "40px", margin: "25px " }} />
          <a style={{ fontSize: "24px", fontWeight: "600" }}>Blockmunity</a>
        </div>
      </Link>
      <Menu pointing secondary size="huge">
        <Menu.Item name="home" active={activeItem === "/"}>
          <Link href="/">
            <a>메인</a>
          </Link>
        </Menu.Item>
        <Menu.Item name="board" active={activeItem === "/board"}>
          <Link href="/board">
            <a>게시판</a>
          </Link>
        </Menu.Item>
        <Menu.Item active={activeItem === "/exchange"}>
          <Link href="/exchange">
            <a>교환소</a>
          </Link>
        </Menu.Item>
        <Menu.Item active={activeItem === "/wirte"}>
          <Link href="/write">
            <a>글쓰기</a>
          </Link>
        </Menu.Item>
        <Menu.Menu position="right">
          {isLogin ? (
            <>
              <Menu.Item>
                <div onClick={logout}>
                  <a>로그아웃</a>
                </div>
              </Menu.Item>
              <Menu.Item active={activeItem === "/mypage"}>
                <Link href="/mypage">
                  <a>마이페이지</a>
                </Link>
              </Menu.Item>
            </>
          ) : (
            <>
              <Menu.Item active={activeItem === "/login"}>
                <Link href="/login">
                  <a>로그인</a>
                </Link>
              </Menu.Item>
              <Menu.Item active={activeItem === "/signup"}>
                <Link href="/signup">
                  <a>회원가입</a>
                </Link>
              </Menu.Item>
            </>
          )}
        </Menu.Menu>
      </Menu>
    </>
  );
}
