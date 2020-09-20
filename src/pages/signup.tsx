import { useState, useEffect } from 'react';
import Router from 'next/router'
import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input/input";
import ProgressButton from "../components/button/progress";
import SocialButton from "../components/button/social";
import Link from "next/link";
import { useRequest } from '../hooks/use-request';
import { fire } from '../../server/utils/firebase';

const SignUp = () => {
    const [user, setUser] = useState(null);
    const [ughId, setUghId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [dob, setDob] = useState(new Date().toString());
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [messages, setMessages] = useState([]);
    const { doRequest } = useRequest({
        url: "/api/ugh/user/signup",
        body: { ughId, name, email, dob: new Date(dob), password },
        method: "post",
        onError: (errors) => setMessages(errors),
        onSuccess: () => Router.push("/account/activate")
    });

    const onChangeHandler = (name: string, value: string) => {

        switch (name) {
            case 'ughId': return setUghId(value);
            case 'name': return setName(value);
            case 'email': return setEmail(value);
            case 'dob': return setDob(value);
            case 'password': return setPassword(value);
            case 'password2': return setPassword2(value);
        }
    }
    const { doRequest: doSocialRequest } = useRequest({
        url: "/api/ugh/user/social-auth",
        body: user,
        method: "post",
        onError: (errors) => setMessages(errors),
        onSuccess: (data) => Router.push(data ? "/profile?newauth=true" : "/profile"),
    });

    const onSocialAuthProvider = async (authFunc) => {
        try {
            const newUser = await authFunc();
            const socialUser = {
                name: newUser.displayName,
                email: newUser.email,
                uploadUrl: newUser.photoURL
            }
            setUser(socialUser);
        } catch (error) {
            console.log({ error })
        }
    }

    useEffect(() => {
        if (user) doSocialRequest()
    }, [user])
    return <MainLayout messages={messages}>
        <section className="signin">
            <h1 style={{ marginBottom: 10 }}>Register</h1>
            <Input placeholder="ugh id*" name="ughId" onChange={onChangeHandler} value={ughId} />
            <Input placeholder="name*" name="name" onChange={onChangeHandler} value={name} />
            <Input placeholder="email*" type="email" name="email" onChange={onChangeHandler} value={email} />
            <Input placeholder="date of birth*" type="date" name="dob" onChange={onChangeHandler} value={dob} />
            <Input placeholder="password*" type="password" name="password" onChange={onChangeHandler} value={password} />
            <Input placeholder="confirm password*" type="password" name="password2" onChange={onChangeHandler} value={password2} />
            <ProgressButton text="Register" size="large" type="link" onPress={async (_, next) => {
                if (password !== password2 || password.length === 0) {
                    setMessages([{ message: "passwords do not match" }])
                    next();
                    return
                }
                await doRequest();
                next();
            }} />
            <div className="signin__other">
                <div style={{ textTransform: "capitalize", textAlign: "center", fontSize: 16, fontWeight: 700 }}>already have an account ?&nbsp;
                    <Link href="/login">
                        <a style={{ textDecoration: "none" }}>Login</a>
                    </Link>
                </div>
            </div>
            <div style={{ margin: ".5rem 0", fontSize: 16, fontWeight: 700 }}> Or Login with</div>
            <SocialButton onPress={() => { onSocialAuthProvider(fire.facebook) }} size="medium" type="facebook">Facebook</SocialButton>
            <div style={{ margin: "1rem 0" }} />
            <SocialButton onPress={() => { onSocialAuthProvider(fire.google) }} size="medium" type="gplus">Google</SocialButton>
        </section>
    </MainLayout>
};

export default SignUp;
