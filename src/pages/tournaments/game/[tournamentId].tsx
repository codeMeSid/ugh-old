import React from "react";
import MainLayout from "../../../components/layout/mainlayout";
import { serverRequest } from "../../../hooks/server-request";

const BracketPage = ({ brackets }) => {
    return <MainLayout>
        <div>s</div>

    </MainLayout>
}

BracketPage.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query;
    const { data, errors } = await serverRequest(ctx, {
        url: `api/ugh/tournament/fetch/bracket/${tournamentId}`,
        method: "get",
        body: {}
    });
    console.log(data[0].teamA);
    return {
        brackets: data,
        errors: errors || []
    }
}



export default BracketPage;