import Router from "next/router";
import { useEffect } from "react";
import { fire } from "../../server/utils/firebase";
import MainLayout from "../components/layout/mainlayout";
import { useRequest } from "../hooks/use-request";

const SignoutImg = require("../public/asset/about-bg.jpg");

const SignoutPage = () => {
  const { doRequest } = useRequest({
    url: "/api/ugh/user/signout",
    method: "get",
    body: {},
    onSuccess: async () => {
      await fire.removeFcmToken();
      Router.replace("/");
    },
  });
  useEffect(() => {
    doRequest();
  }, []);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundImage: `url(${SignoutImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 36, color: "white" }}>Let's Play Again Soon</div>
    </div>
  );
};

export default SignoutPage;
