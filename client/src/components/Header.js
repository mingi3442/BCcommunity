import React, { useState, useEffect } from "react";
import { Input, Icon, Label } from "semantic-ui-react";
import styles from "./Header.module.css";
import Link from "next/link";

export default function Header({ isLogin }) {
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
  return (
    <div className={styles.header}>
      <div className={styles.Container}>
        <Link href="/">
          <a className={styles.logo}>
            <img src="/logo.png" alt="logo" style={{ display: "flex", width: "40px", margin: "25px" }} />
            <span>Blockmunity</span>
          </a>
        </Link>
        {/* <Input icon="search" placeholder="Search items, collections, and accounts" style={{ width: "50rem", height: "45px" }} /> */}
        <ul className={styles.nav}>
          <li>
            <div>{!isLogin ? <Label color="red"> Unconnected Accout</Label> : <Label color="green"> Connected Accout</Label>}</div>
          </li>
          <li>
            <Link href="/board">
              <a>게시판</a>
            </Link>
          </li>
          <li>
            <Link href="/write">
              <a>글쓰기</a>
            </Link>
          </li>
          <li>
            <Link href="/signup">
              <a>회원가입</a>
            </Link>
          </li>
          <li>
            <Link href="/login">
              <a>로그인</a>
            </Link>
          </li>
          <li>
            <Link href="/mypage">
              <a>마이페이지</a>
            </Link>
          </li>
          {/* <li>
            <Link href="/mypage">
              <Icon name="user circle outline" size="large" />
            </Link>
          </li> */}
          {/* <li>
            <div onClick={loginButton}>
              <img className={styles.icon} src="/images/icon_metamask.jpg" />
            </div>
          </li>
          <li>
            <div onClick={kaikasLoginButton}>
              <img className={styles.icon} src="/images/icon_kaikas.png" />
            </div>
          </li> */}
          {/* <li>
            {isLogin ? (
              <div onClick={loginButton}>
                <Icon name="sign-out" size="large" />
              </div>
            ) : (
              <div onClick={loginButton}>
                <Icon name="sign-in" size="large" />
              </div>
            )}
          </li> */}
        </ul>
      </div>
    </div>
  );
}
