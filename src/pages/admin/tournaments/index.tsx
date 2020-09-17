import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout"
import Table from "../../../components/table"
import { useRequest } from '../../../hooks/use-request';
import { TournamentDoc } from '../../../../server/models/tournament';
import Link from 'next/link';
import { format } from 'date-fns';
import Button from '../../../components/button/main';

const AdminTournamentDashboard = () => {
    const [tData, setTData] = useState([]);
    const [messages, setMessages] = useState([])
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
                    TableLink(t.name, t.regId),
                    `${t.coins} coins`,
                    format(new Date(t.startDateTime), "dd/MM/yyyy hh:mm a"),
                    `${t.game.name} (${t.game.console.toUpperCase()})`,
                    <div>{t.players.length}/{t.playerCount}</div>,
                    t.status.toUpperCase()
                ];
            }));
        },
        onError: (errors) => setMessages(errors)
    });
    useEffect(() => {
        doRequest();
    }, []);

    return <SideLayout messages={messages} title={`match(${tData.length})`}>
        <Link href="/admin/tournaments/add">
            <a style={{ marginBottom: 20 }}>
                <Button text="Add Tournament" />
            </a>
        </Link>
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