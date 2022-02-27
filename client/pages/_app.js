import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import Header from "../src/components/Header";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({});
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
