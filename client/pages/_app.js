import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({});
  // console.log(userInfo);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    if (userInfo.username !== undefined) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [userInfo]);
  return (
    <div>
      <Header isLogin={isLogin} setUserInfo={setUserInfo} setIsLogin={setIsLogin} />
      <Component setUserInfo={setUserInfo} userInfo={userInfo} setIsLogin={setIsLogin} isLogin={isLogin} />
      <Footer />
    </div>
  );
}

export default MyApp;
