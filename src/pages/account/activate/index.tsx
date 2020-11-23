import MainLayout from "../../../components/layout/mainlayout";
const mailSent = require("../../../public/asset/email-sent.gif");

const PreActivate = () => <MainLayout>
    <div style={{ minHeight: "88vh", textAlign: "center" }}>
        <h1 style={{ marginTop: 50 }}>Registration Successful!</h1>
        <div style={{ fontSize: 24, marginTop: 20 }}>A verification link has been sent to your e-mail Id.</div>
        <div style={{ fontSize: 24, marginTop: 20 }}> Please activate your account by verifying the e-mail address</div>
        <div style={{ maxWidth: 400, maxHeight: 200, margin: "0 auto" }}>
            <img src={mailSent} width="100%" />
        </div>
    </div>
</MainLayout >

export default PreActivate