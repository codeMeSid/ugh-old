import { useState } from "react";
import ProgressButton from "../../components/button/progress";
import Input from "../../components/input/input";
import MainLayout from "../../components/layout/mainlayout";
import { useRequest } from "../../hooks/use-request";

const LoginBg = require("../../public/asset/login.webp");

export default () => {
  const [messages, setMessages] = useState([]);
  const [email, setEmail] = useState("");

  const { doRequest } = useRequest({
    url: "/api/ugh/user/recovery",
    body: { email },
    method: "post",
    onSuccess: () =>
      setMessages([
        { message: "Reset link sent to your email Id !!!", type: "success" },
      ]),
    onError: (data) => setMessages(data),
  });

  return (
    <MainLayout messages={messages}>
      <section
        className="signin"
        style={{ backgroundImage: `url(${LoginBg})` }}
      >
        <h1
          style={{
            textTransform: "uppercase",
            color: "white",
            marginBottom: 20,
            fontSize: 38,
          }}
        >
          Forgot Password
        </h1>
        <div className="row">
          <Input
            placeholder="email"
            type="email"
            isWhite
            value={email}
            onChange={(n, v) => setEmail(v)}
          />
        </div>
        <div className="row">
          <ProgressButton
            text="SEND LINK"
            type="secondary"
            size="large"
            onPress={async (_, n) => {
              await doRequest();
              n();
            }}
          />
        </div>
      </section>
    </MainLayout>
  );
};
