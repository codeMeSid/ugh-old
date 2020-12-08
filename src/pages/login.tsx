import { useState, useEffect } from "react";
import Router from "next/router";
import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input/input";
import ProgressButton from "../components/button/progress";
import SocialButton from "../components/button/social";
import Link from "next/link";
import { useRequest } from "../hooks/use-request";
import { fire } from "../../server/utils/firebase";

const LoginBg = require("../public/asset/login.jpg");
const GoogleButton = require("../public/asset/google.png");

const SignIn = () => {
  const [user, setUser] = useState(null);
  const [ughId, setUghId] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);

  const onChangeHandler = (name: string, value: string) => {
    switch (name) {
      case "ughId":
        return setUghId(value);
      case "password":
        return setPassword(value);
    }
  };
  const { doRequest: doSocialRequest } = useRequest({
    url: "/api/ugh/user/social-auth",
    body: user,
    method: "post",
    onSuccess: (data) =>
      Router.push(data ? "/profile?newauth=true" : "/profile"),
    onError: (errors) => setMessages(errors),
  });
  const onSocialAuthProvider = async (authFunc) => {
    try {
      const newUser = await authFunc();
      const socialUser = {
        name: newUser.displayName,
        email: newUser.email,
        uploadUrl: newUser.photoURL,
      };
      setUser(socialUser);
    } catch (error) {
      setMessages([{ message: "Social auth failed" }]);
    }
  };

  useEffect(() => {
    if (user) doSocialRequest();
  }, [user]);
  return (
    <MainLayout messages={messages}>
      <section
        className="signin"
        style={{ backgroundImage: `url(${LoginBg})` }}
      >
        <div className="signin__container">
          <h1 style={{ marginBottom: 10 }}>Sign In</h1>
          <Input
            placeholder="ugh id*"
            name="ughId"
            onChange={onChangeHandler}
            isWhite
          />
          <Input
            placeholder="password*"
            type="password"
            name="password"
            onChange={onChangeHandler}
            isWhite
          />
          <ProgressButton
            text="Sign In"
            size="large"
            type="link"
            onPress={(_, next) => {
              const { doRequest } = useRequest({
                url: "/api/ugh/user/signin",
                body: { ughId, password },
                method: "post",
                onError: (errors) => {
                  next(false, "Login Failed");
                  setMessages(errors);
                },
                onSuccess: () => Router.push("/profile"),
              });
              doRequest();
            }}
          />
          <div className="signin__other">
            <div
              style={{
                textTransform: "capitalize",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              forgot password ?&nbsp;
              <Link href="/account/forgot-password">
                <a style={{ textDecoration: "none" }}>Reset it</a>
              </Link>
            </div>
            <div
              style={{ textAlign: "center", margin: ".5rem 0", fontSize: 14 }}
            >
              OR
            </div>
            <div
              style={{
                textTransform: "capitalize",
                textAlign: "center",
                fontSize: 16,
                fontWeight: 700,
              }}
            >
              need new account ?&nbsp;
              <Link href="/signup">
                <a style={{ textDecoration: "none" }}>Sign up</a>
              </Link>
            </div>
          </div>
          <div style={{ margin: ".5rem 0", fontSize: 16, fontWeight: 700 }}>
            Login with
          </div>
        </div>
        <SocialButton
          onPress={() => onSocialAuthProvider(fire.facebook)}
          size="large"
          type="facebook"
        >
          Facebook
        </SocialButton>
        <div style={{ margin: "1rem 0" }} />
        <img
          onClick={() => onSocialAuthProvider(fire.google)}
          style={{ cursor: "pointer" }}
          width="192px"
          height="50px"
          src={GoogleButton}
          alt="google signup"
        />
      </section>
    </MainLayout>
  );
};

export default SignIn;
