import React, { useState } from "react";
import ProgressButton from "../../../components/button/progress";
import Input from "../../../components/input/input";
import MainLayout from "../../../components/layout/mainlayout"
import { useRequest } from "../../../hooks/use-request";
import Router from 'next/router';

const LoginBg = require("../../../public/asset/login.jpg");

const ResetPassword = ({ recoveryToken }) => {
    const [messages, setMessages] = useState([]);
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");

    const { doRequest } = useRequest({
        url: `/api/ugh/user/reset/${recoveryToken}`,
        body: { password },
        method: "put",
        onSuccess: () => {
            setMessages([{ message: "Password was reset successfully", type: "success" }])
            setTimeout(() => Router.replace("/login"), 5000)
        },
        onError: (data) => setMessages(data)
    });
    return <MainLayout messages={messages}>
        <section className="signin" style={{ backgroundImage: `url(${LoginBg})` }}>
            <h1 style={{ textTransform: "uppercase", color: "white", marginBottom: 20 }}>Reset Password</h1>
            <div className="row">
                <Input placeholder="password" type="password" isWhite value={password} onChange={(n, v) => setPassword(v)} />
            </div>
            <div className="row">
                <Input placeholder="confirm password" type="password" isWhite value={password2} onChange={(n, v) => setPassword2(v)} />
            </div>
            <div className="row">
                <ProgressButton text="RESET PASSWORD" type="secondary" size="large" onPress={async (_, n) => {
                    if (!password || password !== password2) {
                        n();
                        return setMessages([{ message: "Passwords do not match" }])
                    }
                    await doRequest();
                    n();
                }} />
            </div>
        </section>
    </MainLayout>
}

ResetPassword.getInitialProps = async (ctx) => {
    const { recoveryToken } = ctx.query;
    return { recoveryToken }
}

export default ResetPassword