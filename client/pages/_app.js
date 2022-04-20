import "../styles/globals.css";
import "semantic-ui-css/semantic.min.css";
import { AppProps } from "next/app";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

// interface IUserInfo {
//   address: string;
//   createdAt: string;
//   erc20: number;
//   eth: number;
//   mnemonic: string;
//   password: string;
//   privateKey: string;
//   updatedAt: string;
//   userID: string;
//   username: string;
//   __v: number;
//   _id: string;
// }

// function MyApp({ Component, pageProps }: AppProps) {
function MyApp({ Component, pageProps }) {
  // const [userInfo, setUserInfo] = useState<IUserInfo>();
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
    <>
      <Header isLogin={isLogin} setUserInfo={setUserInfo} setIsLogin={setIsLogin} />
      {/* <Component /> */}
      <Component setUserInfo={setUserInfo} userInfo={userInfo} setIsLogin={setIsLogin} isLogin={isLogin} />
      <Footer />
    </>
  );
}

export default MyApp;
