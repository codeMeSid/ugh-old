import { useState, useEffect } from 'react';
import Router from 'next/router'
import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input";
import ProgressButton from "../components/progress-button";
import SocialButton from "../components/social-button";
import Link from "next/link";
import { useRequest } from '../hooks/use-request';

const SignUp = () => {
    const [canRequest, setCanRequest] = useState(false);
    const [ughId, setUghId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState(new Date());
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const { doRequest } = useRequest({ url: "/api/ugh/user/signup", body: { ughId, name, email, dob, password }, method: "post", onSuccess: () => Router.push("/activation") });
    useEffect(() => {
        if (password.length > 0 && password === password2) setCanRequest(true);
        else if (canRequest) setCanRequest(false);
    }, [password2, password]);
    const onChangeHandler = (name: string, value: string) => {

        switch (name) {
            case 'ughId': return setUghId(value);
            case 'name': return setName(value);
            case 'email': return setEmail(value);
            case 'dob': return setDob(new Date(value));
            case 'password': return setPassword(value);
            case 'password2': return setPassword2(value);
        }
    }
    return <MainLayout>
        <div className="signin">
            <h1 style={{ marginBottom: 10 }}>Register</h1>
            <Input placeholder="ugh id*" name="ughId" onChange={onChangeHandler} value={ughId} />
            <Input placeholder="name*" name="name" onChange={onChangeHandler} value={name} />
            <Input placeholder="email*" type="email" name="email" onChange={onChangeHandler} value={email} />
            <Input placeholder="date of birth*" type="date" name="dob" onChange={onChangeHandler} value={dob} />
            <Input placeholder="password*" type="password" name="password" onChange={onChangeHandler} value={password} />
            <Input placeholder="confirm password*" type="password" name="password2" onChange={onChangeHandler} value={password2} />
            <ProgressButton disabled={!canRequest} text="Register" size="large" type="link" onPress={async (_, next) => {
                await doRequest();
                next();
            }} />
            <div className="signin__other">
                <div style={{ textTransform: "capitalize", textAlign: "center", fontSize: 16, fontWeight: 700 }}>already have an account ?&nbsp;
                    <Link href="/signin">
                        <a style={{ textDecoration: "none" }}>Login</a>
                    </Link>
                </div>
            </div>
            <div style={{ margin: ".5rem 0", fontSize: 16, fontWeight: 700 }}> Or Login with</div>
            <SocialButton size="medium" type="facebook">Facebook</SocialButton>
            <div style={{ margin: "1rem 0" }} />
            <SocialButton size="medium" type="gplus">Google</SocialButton>
        </div>
    </MainLayout>
};

export default SignUp;
