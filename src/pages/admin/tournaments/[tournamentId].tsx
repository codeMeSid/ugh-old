import { serverRequest } from "../../../hooks/server-request";
import { TournamentDoc } from "../../../../server/models/tournament";
import SideLayout from "../../../components/layout/sidelayout";
import Input from "../../../components/input/input";
import { format } from 'date-fns'

const TournamentDetail = ({ tournament }: { tournament: TournamentDoc }) => {
    return <SideLayout title="Match detail">
        <div className="detail">
            <div className="row">
                <div className="col">
                    <Input placeholder="name" value={tournament?.name} disabled />
                </div>
                <div className="col">
                    <Input placeholder="status" value={tournament?.status?.toUpperCase()} disabled />
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
                    <Input placeholder="start by" value={format(new Date(tournament?.startDateTime), "dd/MM/yyyy hh:mm a")} disabled />
                </div>
                <div className="col">
                    <Input placeholder="end by" value={format(new Date(tournament?.endDateTime), "dd/MM/yyyy hh:mm a")} disabled />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input placeholder="added by" value={tournament?.addedBy?.email} disabled />
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
                    <Input placeholder="grouping" value={tournament?.group} disabled />
                </div>
            </div>
        </div>
    </SideLayout>
}

TournamentDetail.getInitialProps = async (ctx) => {
    const { tournamentId } = ctx.query
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/tournament/fetch/detail/${tournamentId}`, body: {}, method: "get" });
    return { tournament: data }
}

export default TournamentDetail;