import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import Button from "../../../components/button/main"
import { useRequest } from '../../../hooks/use-request';
import { TournamentDoc } from '../../../../server/models/tournament';
import Link from 'next/link';

const AdminTournamentDashboard = () => {
    const [tData, setTData] = useState([]);
    const formatDate = (date: Date) => {
        const d = new Date(date);
        const day = d.getDate();
        const month = d.getMonth();
        const year = d.getFullYear();
        const hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
        const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
        const timeHandle = d.getHours() < 12 ? "am" : "pm";
        return `${day}/${month}/${year} ${hour}:${minutes}${timeHandle}`;
    }
    const TableLink = (name: string, id: string) => <Link href={`/admin/tournaments/${id}`}>
        <a className="table__link">{name}</a>
    </Link>

    const { doRequest } = useRequest({
        url: "/api/ugh/tournament/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<TournamentDoc>) => {
            setTData(data.map(t => {
                return [
                    TableLink(t.name, t.id),
                    `${t.coins} coins`,
                    formatDate(t.startDateTime),
                    `${t.game.name} (${t.game.console.toUpperCase()})`,
                    <div>{t.players.length}/{t.playerCount}</div>,
                    t.status.toUpperCase()
                ];
            }));
        }
    });
    useEffect(() => {
        doRequest();
    }, []);
    return <SideLayout title={`match(${tData.length})`}>
        <div style={{ display: "flex", alignItems: "center" }}>
            <Button size="icon" text="+" style={{ marginBottom: 10, marginRight: 10 }} />
            <h1>Add tournament</h1>
        </div>
        <Table headers={[
            {
                text: "name",
                isResponsive: false
            },
            {
                text: "entry coins",
                isResponsive: true
            },
            {
                text: "start date",
                isResponsive: false
            },
            {
                text: "game",
                isResponsive: false
            },
            {
                text: "players",
                isResponsive: true
            },
            {
                text: "status",
                isResponsive: false
            }
        ]} data={tData} />
    </SideLayout>
}

export default AdminTournamentDashboard