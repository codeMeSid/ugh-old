import { useState, useEffect } from 'react';
import SideLayout from "../../../components/layout/sidelayout";
import Table from "../../../components/table"
import Button from "../../../components/button/main"
import { useRequest } from '../../../hooks/use-request';
import { GameDoc } from '../../../../server/models/game';
import Switch from 'react-switch';
import Link from 'next/link';

const AdminGamesDashboard = () => {
    const [gameData, setGameData] = useState([]);
    const [messages, setMessages] = useState([]);
    const SwitchBlade = (id: string, activity: boolean) => {
        return <Switch checked={activity} onChange={() => changeGameActivity(id)} />
    }
    const TableLink = (name: string, id: string) => <Link href={`/admin/games/${id}`}>
        <a className="table__link">{name.toUpperCase()}</a>
    </Link>
    const { doRequest } = useRequest({
        url: "/api/ugh/game/fetch/all",
        body: {},
        method: "get",
        onSuccess: (data: Array<GameDoc>) => {
            setGameData(data.map(game => ([
                <>
                    <div>{TableLink(game.name, game.id)}</div>
                    <div>({game.console.toUpperCase()})</div>
                </>,
                <a href={game.imageUrl} target="_blank"><img className="gallery__image" src={game.imageUrl} /></a>,
                SwitchBlade(game.id, game.isActive)
            ])))
        },
        onError: (errors) => setMessages(errors)
    });
    useEffect(() => {
        doRequest();
    }, []);
    const changeGameActivity = async (id: string) => {
        const { doRequest: updateGameRequest } = useRequest({
            url: `/api/ugh/game/update/activity/${id}`,
            method: "put",
            body: {},
            onSuccess: () => setMessages([{ message: "Game updated successfully", type: "success" }]),
            onError: (errors) => setMessages(errors)
        });
        await updateGameRequest();
        await doRequest();
    }
    // render
    return <SideLayout messages={messages} title={`games(${gameData.length})`}>
        <Link href="/admin/games/add">
            <a><Button text="Add Game" /></a>
        </Link>
        <Table headers={[
            { text: "name", isResponsive: false },
            { text: "image", isResponsive: false },
            { text: "activity", isResponsive: false }]} data={gameData} />
    </SideLayout>
}

export default AdminGamesDashboard