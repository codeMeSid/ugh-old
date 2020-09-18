import Router from "next/router"
import { useEffect } from "react"
import MainLayout from "../components/layout/mainlayout"
import { useRequest } from "../hooks/use-request"

const SignoutImg = require("../public/asset/about-bg.jpg");

export default () => {

    const { doRequest } = useRequest({
        url: "/api/ugh/user/signout",
        method: "get",
        body: {},
        onSuccess: Router.reload
    })

    useEffect(() => {
        doRequest();
    }, []);

    return <MainLayout>
        <div style={{
            width: "100vw",
            height: "88vh",
            backgroundImage: `url(${SignoutImg})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <div style={{ fontSize: 36, color: "white" }}>
                Let's Play Again Soon
            </div>
        </div>
    </MainLayout>
}
