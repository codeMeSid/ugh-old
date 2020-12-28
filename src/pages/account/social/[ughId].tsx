import { useEffect, useState } from "react";
import { fire } from "../../../../server/utils/firebase";
import ProgressButton from "../../../components/button/progress";
import Input from "../../../components/input/input";
import MainLayout from "../../../components/layout/mainlayout";
import { useRequest } from "../../../hooks/use-request";
import Router from "next/router";
import { differenceInYears } from "date-fns";

const SocialActivatePage = ({ ughId }) => {
  const [mobile, setMobile] = useState("+91");
  const [dob, setDob] = useState(new Date());
  const [otp, setOtp] = useState("");
  const [canSendOtp, setCanSendOtp] = useState(false);
  const [rcv, setRcv] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!ughId) return setMessages([{ messages: "Invalid Request" }]);
  }, []);

  const onInputHandler = (name: string, val: string) => {
    switch (name) {
      case "dob":
        return setDob(new Date(val));
      case "mobile":
        return setMobile(val);
      case "otp":
        return setOtp(val);
    }
  };

  const { doRequest: verificationRequest } = useRequest({
    url: `/api/ugh/user/social-auth/activate/${ughId}`,
    body: {
      mobile,
      dob,
    },
    method: "post",
    onSuccess: () => {
      alert(
        "Account Successfully activated, you have been awarded 250 UGH coins to start playing tournaments. See you there!!!"
      );
      Router.replace("/profile");
    },
    onError: (errors) => setMessages(errors),
  });

  const onOtpSendHandler = (_: any, next: any) => {
    const mobRegex = new RegExp("[+]91[1-9]{1}[0-9]{9}");
    if (!mobRegex.test(mobile)) {
      setMessages([{ message: "Invalid Mobile Number Format" }]);
      next(false, "Failed");
      return;
    }
    if (differenceInYears(Date.now(), new Date(dob)) < 13) {
      setMessages([{ message: "Minimum Age should be 13 years" }]);
      next(false, "Failed");
      return;
    }
    setCanSendOtp(true);
    recaptchaVerifierContainer(mobile);
    next();
  };

  const recaptchaVerifierContainer = async (mobile: string) => {
    const recaptchaVerifier = fire.getRecaptcha("recaptcha-container", () =>
      sendOtp(mobile)
    );
    if (recaptchaVerifier) await recaptchaVerifier.render();
    return recaptchaVerifier;
  };

  const sendOtp = async (mobile: string) => {
    const result = await fire.phoneAuth(mobile);
    if (result) setRcv(true);
    else setMessages([{ message: "Refresh the page and try again." }]);
  };

  const otpVerificationHandler = async (_: any, next: any) => {
    if (!otp) {
      setMessages([{ message: "Enter Valid Otp" }]);
      return next();
    }
    const { status, message } = await fire.verifyPhoneAuth(otp);
    if (!status) {
      next(false, "Failed");
      setMessages([{ message }]);
    } else {
      next();
      verificationRequest();
    }
  };

  return (
    <MainLayout messages={messages}>
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 50,
        }}
      >
        <div style={{ fontSize: 38, fontWeight: 900 }}>Account Activation</div>
        <div
          style={{
            fontSize: 24,
            textAlign: "center",
            maxWidth: 600,
            color: "red",
            margin: "20px 0",
          }}
        >
          Kindly update your Date of Birth and mobile number for OTP
          verification *
        </div>
        <div className="detail">
          <div className="row">
            <Input
              placeholder="Mobile(+91)"
              name="mobile"
              value={mobile}
              onChange={onInputHandler}
            />
          </div>
          <div className="row">
            <Input
              type="date"
              placeholder="Date of Birth"
              name="dob"
              value={dob}
              onChange={onInputHandler}
            />
          </div>
          <ProgressButton
            text="Send OTP"
            type="link"
            onPress={onOtpSendHandler}
            disabled={canSendOtp}
          />
        </div>
        <div
          style={{
            marginTop: 20,
            display: canSendOtp ? "flex" : "none",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            id="recaptcha-container"
            style={{ display: rcv ? "none" : "block" }}
          />
          <div className="detail">
            <div className="row">
              <Input
                placeholder="OTP"
                type="number"
                name="otp"
                value={otp}
                onChange={onInputHandler}
              />
            </div>
            <ProgressButton
              text="Verify OTP"
              type="link"
              onPress={otpVerificationHandler}
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
      </div>
    </MainLayout>
  );
};
SocialActivatePage.getInitialProps = async (ctx: any) => {
  const { ughId } = ctx.query;
  return { ughId };
};

export default SocialActivatePage;
