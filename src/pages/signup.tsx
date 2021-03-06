import React, { useState, useEffect } from "react";
import Router from "next/router";
import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input/input";
import ProgressButton from "../components/button/progress";
import SocialButton from "../components/button/social";
import Link from "next/link";
import { useRequest } from "../hooks/use-request";
import { fire } from "../../server/utils/firebase";
import Select from "../components/input/select";
import { locations } from "../public/location-resource";
import Option from "../components/input/option";
import { serverRequest } from "../hooks/server-request";

const SignUpBg = require("../public/asset/signup.jpg");
const GoogleButton = require("../public/asset/google.png");

const SignUp = ({ ughIds, errors }) => {
  const [user, setUser] = useState(null);
  const [ughId, setUghId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("+91");
  const [dob, setDob] = useState(new Date().toString());
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [messages, setMessages] = useState(errors);
  const [state, setState] = useState("Tamil Nadu");
  const [isLoading, setIsLoading] = useState(false);

  const onChangeHandler = (name: string, value: string) => {
    switch (name) {
      case "ughId": {
        if (`${value}`?.split(" ").length > 1)
          return setMessages([
            { message: "UghId cannot container white space characters" },
          ]);
        return setUghId(value);
      }
      case "name":
        return setName(value);
      case "email":
        return setEmail(value);
      case "dob":
        return setDob(value);
      case "password":
        return setPassword(value);
      case "password2":
        return setPassword2(value);
      case "mobile":
        return setMobile(value);
    }
  };
  const { doRequest: doSocialRequest } = useRequest({
    url: "/api/ugh/user/social-auth",
    body: user,
    method: "post",
    onError: (errors) => {
      setMessages(errors);
      setIsLoading(false);
    },
    onSuccess: (data) => {
      data.activity === "inactive"
        ? Router.push(`/account/social/${data.ughId}`)
        : Router.replace("/profile");
    },
  });

  const onSocialAuthProvider = async (authFunc) => {
    setIsLoading(true);
    try {
      const newUser = await authFunc();
      const socialUser = {
        name: newUser.displayName,
        email: newUser.email,
        uploadUrl: newUser.photoURL,
      };
      setUser(socialUser);
    } catch (error) {
      setIsLoading(false);
      setMessages([{ message: error.message }]);
    }
  };

  useEffect(() => {
    if (user) doSocialRequest();
  }, [user]);
  return (
    <MainLayout messages={messages}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          minHeight: "100%",
          width: "100vw",
          backgroundColor: "rgba(0,0,0,0.8)",
          zIndex: 20,
          display: isLoading ? "flex" : "none",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          fontSize: 40,
          fontWeight: "lighter",
        }}
      >
        LOADING...
      </div>
      <section
        className="signin"
        style={{ backgroundImage: `url(${SignUpBg})` }}
      >
        <div className="signin__container">
          <div style={{ marginBottom: 10, fontSize: 38 }}>Register</div>
          <Input
            placeholder="ugh id*"
            name="ughId"
            onChange={onChangeHandler}
            value={ughId}
            isWhite
          />
          {ughId.length > 4 && (
            <div className="signin__ughid ">
              {Array.from(ughIds).filter(({ ughId: u }) => {
                return u === ughId;
              }).length > 0 &&
                !new RegExp('[!@#$%^&*(),.?":{}|<>]').test(ughId) && (
                  <div className="signin__ughid--fail">
                    this UGH ID is already taken.
                  </div>
                )}
              {Array.from(ughIds).filter(({ ughId: u }) => {
                return u === ughId;
              }).length === 0 &&
                !new RegExp('[!@#$%^&*(),.?":{}|<>]').test(ughId) && (
                  <div className="signin__ughid--success">
                    UGH ID is available.
                  </div>
                )}
            </div>
          )}
          {ughId.length > 0 && (ughId.length < 4 || ughId.length > 10) && (
            <div className="signin__ughid ">
              <div className="signin__ughid--fail">
                UGH ID should have 4 to 10 characters
              </div>
            </div>
          )}
          {new RegExp('[!@#$%^&*(),.?":{}|<>]').test(ughId) && (
            <div className="signin__ughid ">
              <div className="signin__ughid--fail">
                UGH ID cannot have Spl. characters
              </div>
            </div>
          )}
          <Input
            placeholder="name*"
            name="name"
            onChange={onChangeHandler}
            value={name}
            isWhite
          />
          <Input
            placeholder="email*"
            type="email"
            name="email"
            onChange={onChangeHandler}
            value={email}
            isWhite
          />
          <Input
            placeholder="mobile (+91)*"
            type="text"
            name="mobile"
            onChange={onChangeHandler}
            value={mobile}
            isWhite
          />
          <Input
            placeholder="date of birth*"
            type="date"
            name="dob"
            onChange={onChangeHandler}
            value={dob}
            isWhite
          />
          <Input
            placeholder="password*"
            type="password"
            name="password"
            onChange={onChangeHandler}
            value={password}
            isWhite
          />
          <Input
            placeholder="confirm password*"
            type="password"
            name="password2"
            onChange={onChangeHandler}
            value={password2}
            isWhite
          />
          <Input placeholder="country" value="India" disabled isWhite />
          <Select
            name="state"
            placeholder="state"
            value={state}
            isWhite
            onSelect={(e) => setState(e.currentTarget.value)}
            options={locations.India.map((s) => {
              return <Option key={s} display={s} value={s} />;
            })}
          />
          <ProgressButton
            text="Register"
            size="large"
            type="link"
            onPress={async (_, next) => {
              const mobRegex = new RegExp("[+]91[1-9]{1}[0-9]{9}");
              if (!mobRegex.test(mobile)) {
                setMessages([{ message: "Invalid Mobile Number Format" }]);
                next(false, "Failed");
                return;
              }
              if (password !== password2 || password.length === 0) {
                setMessages([{ message: "passwords do not match" }]);
                next(false, "Failed");
                return;
              }
              if (ughId.length < 4 || ughId.length > 10) {
                setMessages([
                  { message: "UGH ID should have min. 4 to max. 10 chars" },
                ]);
                next(false, "Failed");
                return;
              }
              if (new RegExp('[!@#$%^&*(),.?":{}|<>]').test(ughId)) {
                setMessages([{ message: "UGH ID contains invalid chars." }]);
                next(false, "Failed");
                return;
              }
              if (
                Array.from(ughIds).filter(({ ughId: u }) => {
                  return u === ughId;
                }).length > 0
              ) {
                setMessages([{ message: "UGH ID is already taken" }]);
                next(false, "Failed");
                return;
              }
              const { doRequest } = useRequest({
                url: "/api/ugh/user/signup",
                body: {
                  ughId,
                  name,
                  email,
                  mobile,
                  dob: new Date(dob),
                  password,
                  country: "India",
                  state,
                },
                method: "post",
                onError: (errors) => {
                  setMessages(errors);
                  next(false, "Registration Failed");
                },
                onSuccess: () => Router.push("/account/activate"),
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
              already have an account ?&nbsp;
              <Link href="/login">
                <a style={{ textDecoration: "none" }}>Login</a>
              </Link>
            </div>
          </div>
          <div style={{ margin: ".5rem 0", fontSize: 16, fontWeight: 700 }}>
            {" "}
            Or Login with
          </div>
        </div>
        <SocialButton
          onPress={() => {
            onSocialAuthProvider(fire.facebook);
          }}
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
        <div
          style={{
            color: "white",
            fontSize: 16,
            textTransform: "capitalize",
            margin: "10px 0",
            textAlign: "center",
          }}
        >
          By signing-up you agree to{" "}
          <Link href="/tac">
            <a target="_blank" style={{ textDecoration: "underline" }}>
              Terms Of Use
            </a>
          </Link>{" "}
          and{" "}
          <Link href="/privacy">
            <a target="_blank" style={{ textDecoration: "underline" }}>
              Privacy Policy
            </a>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
};

SignUp.getInitialProps = async (ctx) => {
  const { data, errors } = await serverRequest(ctx, {
    url: "/api/ugh/user/fetch/players/ughId",
    body: {},
    method: "get",
  });
  return {
    ughIds: data || [],
    errors: errors || [],
  };
};

export default SignUp;
