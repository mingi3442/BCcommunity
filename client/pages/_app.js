import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import Header from "../src/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({
    _id: "6219179a7f742d689c12233d",
    username: "aaa",
    password: "aaa",
    address: "0xaf846d6ab8232658911a2011ca020f165b1e78f2",
    privateKey: "evolve file type enemy sheriff shallow cactus arrive another light lady garbage",
  });
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (userInfo.username !== undefined) {
      setIsLogin(!isLogin);
    }
  }, [userInfo]);
  return (
    <div>
      <Header isLogin={isLogin} setUserInfo={setUserInfo} setIsLogin={setIsLogin} />
      <Component setUserInfo={setUserInfo} userInfo={userInfo} setIsLogin={setIsLogin} />
    </div>
  );
}

export default MyApp;
