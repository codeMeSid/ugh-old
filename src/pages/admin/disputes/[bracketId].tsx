import { useState } from "react";
import { serverRequest } from "../../../hooks/server-request";
import { useRequest } from "../../../hooks/use-request";
import Router from 'next/router';
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import ProgressButton from "../../../components/button/progress";
import { DQ } from "../../../../server/utils/enum/dq";

const DisputeDetail = ({ bracket: { team, winner, regId, gameType, tournamentId }, errors }: {
    bracket?: {
        team: {
            user: { ughId: string };
            score?: number;
            uploadUrl: string
        },
        winner: string,
        regId: string,
        gameType: string,
        tournamentId: string
    },
    errors: any
}) => {
    const [messages, setMessages] = useState(errors);
    const disputeHandler = async (accept: boolean) => {
        const { doRequest } = useRequest({
            url: `/api/ugh/bracket/${gameType}/dispute/accept/${regId}`,
            method: "post",
            body: { accept, tournamentId },
            onSuccess: () => Router.replace("/admin/disputes"),
            onError: (errors) => setMessages(errors)
        });
        doRequest();
    }


    const getStatus = () => {
        if (winner === DQ.DisputeLost) return "Disqulified";
        else return "Winner";
    }


    return <SideLayout messages={messages} title={regId}>
        <div className="detail">
            <div className="row">
                <Input placeholder="ugh id" value={team?.user?.ughId} disabled />
            </div>
            <div className="row">
                <Input placeholder={gameType} value={team?.score} disabled />
            </div>
            {
                winner && <div className="row">
                    <Input placeholder="dispute status" value={getStatus()} disabled />
                </div>
            }
            <div className="row">
                <a href={team?.uploadUrl} target="_blank"><img style={{ maxWidth: 400, maxHeight: 200 }} src={team?.uploadUrl} /></a>
            </div>
            {
                !winner && team?.uploadUrl && <>
                    <ProgressButton type="whatsapp" text="Accept" size="medium" style={{ margin: "0 0.5rem" }} onPress={(_, next) => {
                        disputeHandler(true)
                    }} />
                    <ProgressButton type="youtube" text="Reject" size="medium" style={{ margin: "0 0.5rem" }} onPress={(_, next) => {
                        disputeHandler(false)
                    }} />
                </>
            }
        </div>
    </SideLayout>
}

DisputeDetail.getInitialProps = async (ctx) => {
    const { bracketId } = ctx.query
    const { data, errors } = await serverRequest(ctx, {
        url: `/api/ugh/bracket/fetch/dispute/detail/${bracketId}`,
        body: {},
        method: "get"
    });
    return { bracket: data, errors: errors || [] }
}

export default DisputeDetail;