import React, { useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";
import BracketRankCard from "../../components/card/bracket-rank";
import BracketScoreCard from "../../components/card/bracket-score";
import MainLayout from "../../components/layout/mainlayout"
import MessengerList from "../../components/messenger";
import { serverRequest } from "../../hooks/server-request";

const Logo = require("../../public/asset/logo-icon.png");


const BracketList = ({ brackets, errors, userHasUploadedScore, currentUser, tournamentId }:
    { brackets: Array<BracketDoc>, errors: any, userHasUploadedScore: boolean, currentUser: any, tournamentId: string }) => {
    const [messages, setMessages] = useState(errors);
    return <MainLayout messages={messages}>
        <div className="bracket__title">brackets</div>
        <div className="bracket__list">
            {
                brackets?.map(bracket => {
                    if (bracket.gameType === "score") return <BracketScoreCard
                        bracket={bracket}
                        tournamentId={tournamentId}
                        onError={(errors: any) => setMessages(errors)}
                        currentUser={currentUser} key={Math.random()} />
                    else return <BracketRankCard
                        bracket={bracket}
                        tournamentId={tournamentId}
                        onError={(errors: any) => setMessages(errors)}
                        userHasUploadedScore={userHasUploadedScore}
                        currentUser={currentUser} key={Math.random()} />
                })
            }
        </div>
        <MessengerList
            from={currentUser?.role === "admin" ? "admin" : currentUser?.ughId}
            chats={[{ channel: "admin", title: "admin", to: "admin", profile: Logo }]} />
    </MainLayout>
}

BracketList.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query;
    const { data, errors } = await serverRequest(ctx, {
        url: `/api/ugh/bracket/fetch/${tournamentId}`,
        body: {},
        method: "get"
    });
    return { brackets: data?.brackets || [], userHasUploadedScore: !!data?.playerHasUploadedScore, errors: errors || [], tournamentId }
}

export default BracketList;