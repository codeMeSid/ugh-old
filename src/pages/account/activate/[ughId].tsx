import { useEffect, useState } from "react";
import MainLayout from "../../../components/layout/mainlayout";
import { useRequest } from "../../../hooks/use-request";
const AL = require("../../../public/asset/activation_loading.gif");
const AD = require("../../../public/asset/activation_done.gif");


const Activate = ({ ughId }) => {
    const [messages, setMessages] = useState([]);
    const [username, setUsername] = useState("");
    const { doRequest } = useRequest({
        url: `/api/ugh/user/activate/${ughId}`,
        body: {},
        method: "put",
        onError: (errors) => setMessages(errors),
        onSuccess: (name) => setUsername(name)
    })

    useEffect(() => {
        doRequest();
    }, []);
    return <MainLayout messages={messages}>
        <div style={{ minHeight: "88vh", textAlign: "center" }}>
            <h1 style={{ marginTop: 50, color: "green" }}>{username.length > 0 && "Activation Successful!"}</h1>

            <div style={{ fontSize: 24, marginTop: 20 }}>Hi {username.length > 0 ? username : "(Wait for it)"},</div>
            {
                username.length === 0 && <div style={{ fontSize: 24, marginTop: 20 }}>
                    We are processing your account activation request
               </div>
            }
            {username.length > 0 &&
                <div style={{ fontSize: 24, marginTop: 20 }}>You have been credited with 250 UGH coins to get you started</div>
            }
            <div style={{ maxWidth: 400, maxHeight: 200, margin: "0 auto" }}>
                <img src={username.length > 0 ? AD : AL} width="100%" />
            </div>
        </div>

    </MainLayout >
}

Activate.getInitialProps = async (ctx) => {
    return { ughId: ctx.query.ughId }
}

export default Activate;