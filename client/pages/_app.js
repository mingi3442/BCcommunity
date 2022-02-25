import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import Header from "../src/components/Header";
import { useEffect, useState } from "react";

function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  console.log(userInfo);
  console.log(isLogin);
  useEffect(() => {
    if (userInfo.username !== undefined) {
      setIsLogin(!isLogin);
    }
  }, [userInfo]);
  return (
    <div style={{ margin: "100px" }}>
      <Header isLogin={isLogin} setUserInfo={setUserInfo} setIsLogin={setIsLogin} />
      <Component setUserInfo={setUserInfo} userInfo={userInfo} setIsLogin={setIsLogin} />
    </div>
  );
}

export default MyApp;
