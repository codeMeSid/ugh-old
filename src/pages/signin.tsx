import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input";
import ProgressButton from "../components/progress-button";
import SocialButton from "../components/social-button";
import Link from "next/link";

const SignIn = () => {
    return <MainLayout>
        <div className="signin">
            <h1 style={{ marginBottom: 10 }}>Sign In</h1>
            <Input placeholder="ugh id*" name="ughId" />
            <Input placeholder="password*" type="password" name="password" />
            <ProgressButton text="Sign In" size="large" type="link" onPress={(_, next) => next()} />
            <div className="signin__other">
                <div style={{ textTransform: "capitalize", textAlign: "center", fontSize: 16, fontWeight: 700 }}>forgot password ?&nbsp;
                    <Link href="/forgot-password">
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
            <SocialButton size="medium" type="facebook">Facebook</SocialButton>
            <div style={{ margin: "1rem 0" }} />
            <SocialButton size="medium" type="gplus">Google</SocialButton>


        </div>
    </MainLayout>
};

export default SignIn;
