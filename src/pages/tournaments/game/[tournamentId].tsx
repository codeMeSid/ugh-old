import React from "react";
import { BracketDoc } from "../../../../server/models/bracket";
import BracketCard from "../../../components/card/bracket";
import MainLayout from "../../../components/layout/mainlayout";
import { serverRequest } from "../../../hooks/server-request";

const BracketPage = ({ brackets, errors, currentUser }: { brackets?: Array<BracketDoc>, currentUser: any, errors: Array<any> }) => {

    return <MainLayout messages={errors}>
        <div className="brackets">
            <h1 className="brackets__title">Welcome to tournament</h1>
            {brackets.length > 0
                ? <div className="brackets__container">
                    {
                        brackets?.map((bracket) => {
                            return <BracketCard currentUser={currentUser} bracket={bracket} key={Math.random()} />
                        })
                    }
                </div>
                : <div className="brackets__container brackets__container--1">
                    waiting... for players
                </div>
            }
        </div>
    </MainLayout>
}
BracketPage.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query;
    const { data, errors } = await serverRequest(ctx, {
        url: `api/ugh/tournament/fetch/bracket/${tournamentId}`,
        method: "get",
        body: {}
    });
    return {
        brackets: data || [],
        errors: errors || []
    }
}



export default BracketPage;