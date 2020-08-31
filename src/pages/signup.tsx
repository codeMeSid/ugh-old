import MainLayout from "../components/layout/mainlayout";
import Input from "../components/input";
import ProgressButton from "../components/progress-button";
import SocialButton from "../components/social-button";
import Link from "next/link";

const SignUp = () => {
    return <MainLayout>
       <div className="signin">
            <h1 style={{ marginBottom: 10 }}>Register</h1>
            <Input placeholder="ugh id*" name="ughId" />
            <Input placeholder="name*" name="name" />
            <Input placeholder="email*" type="email" name="email" />
            <Input placeholder="date of birth*" type="date" name="dob" />
            <Input placeholder="password*" type="password" name="password" />
            <Input placeholder="confirm password*" type="password" name="password2" />
            <ProgressButton text="Sign In" size="large" type="link" onPress={(_, next) => next()} />
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
