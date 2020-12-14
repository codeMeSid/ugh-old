import React, { useEffect, useState } from "react";
import MainLayout from "../../../components/layout/mainlayout";
import { useRequest } from "../../../hooks/use-request";
import { fire } from "../../../../server/utils/firebase";
import Input from "../../../components/input/input";
import ProgressButton from "../../../components/button/progress";
import Router from "next/router";
import Timer from "../../../components/timer";
const AL = require("../../../public/asset/activation_loading.gif");
const AD = require("../../../public/asset/activation_done.gif");

const Activate = ({ ughId }) => {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [rcv, setRcv] = useState(false);
  const [otp, setOtp] = useState("");
  const [verification, setVerification] = useState(false);
  const { doRequest: verificatoinRequest } = useRequest({
    url: `/api/ugh/user/activate/${ughId}`,
    body: {},
    method: "put",
    onError: (errors) => setMessages(errors),
    onSuccess: (name) => {
      alert(
        "Profile Successfully verified, You have been given bonus of 250 UGH coins."
      );
      Router.replace("/login");
    },
  });
  const { doRequest } = useRequest({
    url: `/api/ugh/user/fetch/detail/${ughId}`,
    body: {},
    method: "get",
    onError: (errors) => setMessages(errors),
    onSuccess: (data) => {
      setUser(data);
      recaptchaVerifierContainer(data);
    },
  });
  useEffect(() => {
    if (ughId) doRequest();
  }, []);

  const recaptchaVerifierContainer = async (userData: any) => {
    const recaptchaVerifier = fire.getRecaptcha("recaptcha-container", () =>
      sendOtp(userData)
    );
    if (recaptchaVerifier) await recaptchaVerifier.render();
    return recaptchaVerifier;
  };

  const sendOtp = async (userData: any) => {
    const result = await fire.phoneAuth(userData.mobile);
    if (result) setRcv(true);
    else setMessages([{ message: "Refresh the page and try again." }]);
  };

  return (
    <MainLayout messages={messages}>
      <div
        style={{
          minHeight: "88vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ fontWeight: "bold" }}>
          Hi {user?.ughId ? user.ughId : "(Wait For It)"},
        </h1>
        {rcv ? (
          <div style={{ margin: "10px 0", fontSize: 20, textAlign: "center" }}>
            An OTP has been sent to {user?.mobile || ""}
          </div>
        ) : (
          <div style={{ margin: "10px 0", fontSize: 20, textAlign: "center" }}>
            Please Click on the Captcha below to proceed
          </div>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            id="recaptcha-container"
            style={{ display: rcv ? "none" : "block" }}
          />
          {rcv && (
            <>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 20,
                }}
              >
                <div>
                  <Input
                    type="number"
                    placeholder="OTP"
                    style={{ textAlign: "center" }}
                    value={otp}
                    onChange={(s, v) => setOtp(v)}
                  />
                </div>
                <div>
                  <ProgressButton
                    text="Verify OTP"
                    type="link"
                    onPress={async (_, next) => {
                      const { status, message } = await fire.verifyPhoneAuth(
                        otp
                      );
                      if (!status) {
                        next(false, "Failed");
                        setMessages([{ message }]);
                      } else {
                        next();
                        verificatoinRequest();
                      }
                    }}
                  />
                </div>
                <div
                  style={{
                    color: "red",
                    marginTop: 10,
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  In case you do not recieve an OTP in 10 mins,
                </div>
                <div
                  style={{
                    color: "red",
                    marginTop: 2,
                    fontSize: 20,
                    textAlign: "center",
                  }}
                >
                  Kindly try again in sometime.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

Activate.getInitialProps = async (ctx: any) => {
  const { ughId } = ctx.query;
  return { ughId };
};

export default Activate;
