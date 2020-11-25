import { serverRequest } from "../../../hooks/server-request";
import { TournamentDoc } from "../../../../server/models/tournament";
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import { format } from 'date-fns'
import Select from "../../../components/input/select";
import Option from "../../../components/input/option";
import { useState } from "react";
import ProgressButton from "../../../components/button/progress";
import { useRequest } from "../../../hooks/use-request";

const TournamentDetail = ({ tournament, errors }: { tournament: TournamentDoc, errors: any }) => {
    const [status, setStatus] = useState(tournament?.status);
    const [messages, setMessages] = useState(errors)

    const { doRequest } = useRequest({
        url: `/api/ugh/tournament/update/status/${tournament?.id}`,
        body: { status },
        method: "put",
        onSuccess: () => setMessages([{ message: "Tournament successfully updated", type: "success" }]),
        onError: (errors) => setMessages(errors)
    })

    return <SideLayout messages={messages} title="Match detail">
        <div className="detail">
            <div className="row">
                <div className="col">
                    <Input placeholder="name" value={tournament?.name} disabled />
                </div>
                <div className="col">
                    <Select name="status" onSelect={(e) => setStatus(e.currentTarget.value)} placeholder="status" value={status} options={
                        ['upcoming', 'started', 'completed','cancelled'].map(st => {
                            return <Option key={st} display={st.toUpperCase()} value={st} />
                        })
                    } />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="entry coins" value={tournament?.coins} disabled />
                </div>
                <div className="col">
                    <Input placeholder="players" value={tournament?.playerCount} disabled />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="start by" value={format(new Date(tournament?.startDateTime || Date.now()), "dd/MM/yyyy hh:mm a")} disabled />
                </div>
                <div className="col">
                    <Input placeholder="end by" value={format(new Date(tournament?.endDateTime || Date.now()), "dd/MM/yyyy hh:mm a")} disabled />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="added by" value={tournament?.addedBy?.ughId} disabled />
                </div>
                <div className="col">
                    <Input placeholder="winners" value={tournament?.winnerCount} disabled />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="game" value={`${tournament?.game?.name}-(${tournament?.game?.console})`} disabled />
                </div>
                <div className="col">
                    <Input placeholder="grouping" value={`${tournament?.group?.name}-${tournament?.group?.participants}`} disabled />
                </div>
            </div>
            <div className="row">
                <ProgressButton text="Submit" type="link" size="large" onPress={async (_, next) => {
                    await doRequest();
                    next();
                }} />
            </div>
        </div>
    </SideLayout>
}

TournamentDetail.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/tournament/fetch/detail/${tournamentId}`, body: {}, method: "get" });
    return { tournament: data, errors: errors || [] }
}

export default TournamentDetail;