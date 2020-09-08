import { useState, useEffect } from 'react';
import Router from 'next/router';
import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input/input";
import ProgressButton from "../components/button/progress";
import SocialButton from "../components/button/social";
import Link from "next/link";
import { useRequest } from '../hooks/use-request';
import { fire } from '../../server/utils/firebase';

const SignIn = () => {
    const [user, setUser] = useState(null);
    const [ughId, setUghId] = useState("");
    const [password, setPassword] = useState("");
    const { doRequest } = useRequest({ url: "/api/ugh/user/signin", body: { ughId, password }, method: "post", onSuccess: () => Router.push("/profile") });
    const onChangeHandler = (name: string, value: string) => {
        switch (name) {
            case 'ughId': return setUghId(value);
            case 'password': return setPassword(value);
        }
    }
    const { doRequest: doSocialRequest } = useRequest({ url: "/api/ugh/user/social-auth", body: user, method: "post", onSuccess: () => Router.push("/profile") });
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
    return <MainLayout>
        <section className="signin">
            <h1 style={{ marginBottom: 10 }}>Sign In</h1>
            <Input placeholder="ugh id*" name="ughId" onChange={onChangeHandler} />
            <Input placeholder="password*" type="password" name="password" onChange={onChangeHandler} />
            <ProgressButton text="Sign In" size="large" type="link" onPress={async (_, next) => {
                await doRequest();
                next()
            }} />
            <div className="signin__other">
                <div style={{ textTransform: "capitalize", textAlign: "center", fontSize: 16, fontWeight: 700 }}>forgot password ?&nbsp;
                    <Link href="/account/forgot-password">
                        <a style={{ textDecoration: "none" }}>Reset it</a>
                    </Link>
                </div>
                <div style={{ textAlign: "center", margin: ".5rem 0", fontSize: 14 }}>OR</div>
                <div style={{ textTransform: "capitalize", textAlign: "center", fontSize: 16, fontWeight: 700 }}>need new account ?&nbsp;
                    <Link href="/signup">
                        <a style={{ textDecoration: "none" }}>Sign up</a>
                    </Link>
                </div>
            </div>
            <div style={{ margin: ".5rem 0", fontSize: 16, fontWeight: 700 }}>Login with</div>
            <SocialButton onPress={() => { onSocialAuthProvider(fire.facebook) }} size="medium" type="facebook">Facebook</SocialButton>
            <div style={{ margin: "1rem 0" }} />
            <SocialButton onPress={() => { onSocialAuthProvider(fire.google) }} size="medium" type="gplus">Google</SocialButton>


        </section>
    </MainLayout>
};

export default SignIn;