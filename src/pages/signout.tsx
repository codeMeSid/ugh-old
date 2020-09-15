import Router from "next/router"
import { useEffect } from "react"
import MainLayout from "../components/layout/mainlayout"
import { useRequest } from "../hooks/use-request"

export default () => {

    const { doRequest } = useRequest({ url: "/api/ugh/user/signout", method: "get", body: {}, onSuccess: Router.reload })

    useEffect(() => {
        doRequest();
    }, []);

    return <MainLayout>
        <div style={{ width: "100vw", height: "50vh" }}></div>
    </MainLayout>
}
