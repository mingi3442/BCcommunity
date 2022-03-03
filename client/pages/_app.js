import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const [userInfo, setUserInfo] = useState({
    _id: "622080bc7255d776df085aa6",
    username: "ss",
    password: "ss",
    title: "WOW",
    desc: "LOL!!",
    address: "0x9a8d121d282595db4f55fc485305fd8bfcd70b7d",
    privateKey: "e32cab1aa569bbd907e69f2dda541ff4289f943d23a37d41e317bdf663f8067e",
    imgUri: "https://media.vlpt.us/images/moment_log/post/b2ba45ce-2050-45b5-9ecd-aae1279089c5/Governance.jpeg?w=768",
    eth: 0.12,
    erc20: 210,
  });
  // console.log(userInfo);
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
      <Footer />
    </div>
  );
}

export default MyApp;
