import Button from "../../../components/button/main"
import Input from '../../../components/input/input';
import { serverRequest } from '../../../hooks/server-request';
import { GameDoc } from '../../../../server/models/game';
import Select from '../../../components/input/select';
import Option from '../../../components/input/option';
import { ConsoleDoc } from '../../../../server/models/console';
import SideLayout from "../../../components/layout/sidelayout"
import { useState } from "react";
import { useRequest } from "../../../hooks/use-request";
import Router from 'next/router';
import ProgressButton from "../../../components/button/progress";

const AddTournament = ({ games, consoles, errors }:
    { games: Array<GameDoc>, consoles: Array<ConsoleDoc>, errors: Array<any> }) => {
    const [consoleIndex, setConsoleIndex] = useState(0);
    const [gameIndex, setGameIndex] = useState(0);
    const [pIndex, setPIndex] = useState(0);
    const [gIndex, setGIndex] = useState(0);
    const [name, setName] = useState("");
    const [coins, setCoins] = useState(10);
    const [startDateTime, setStartDateTime] = useState("");
    const [endDateTime, setEndDateTime] = useState("");
    const [winnerCount, setWinnerCount] = useState(1);
    const [messages, setMessages] = useState(errors);

    const { doRequest } = useRequest({
        url: "/api/ugh/tournament/add",
        body: {
            name,
            coins,
            winnerCount,
            startDateTime: new Date(startDateTime),
            endDateTime: new Date(endDateTime),
            game: games[gameIndex].id,
            playerCount: games[gameIndex].participants[pIndex],
            group: games[gameIndex].groups[gIndex]
        },
        method: "post",
        onSuccess: () => Router.replace("/admin/tournaments"),
        onError: (errors) => setMessages(errors)
    })
    const onChangeHandler = (name: String, val: any) => {
        switch (name) {
            case 'name': return setName(val);
            case 'coins': return setCoins(val);
            case 'startDateTime': return setStartDateTime(val)
            case 'endDateTime': return setEndDateTime(val);
            case 'winnerCount': return setWinnerCount(val);
        }
    }
    const onSelectHandler = (e) => {
        const name = e.currentTarget.name;
        const val = e.currentTarget.value;
        switch (name) {
            case "consoleIndex":
                setConsoleIndex(val);
                setGameIndex(0);
                setPIndex(0);
                setGIndex(0);
                break;
            case 'gameIndex':
                setGameIndex(val);
                setPIndex(0);
                setGIndex(0);
                break;
            case 'pIndex':
                setPIndex(val);
                break;
            case "gIndex":
                setGIndex(val);
                break;
        }
    }
    return <SideLayout messages={messages} title="add match">
        <div className="detail">
            <div className="row">
                <div className="col">
                    <Input placeholder="name" name="name" value={name} onChange={onChangeHandler} />
                </div>
                <div className="col">
                    <Input type="number" placeholder="coins" name="coins" value={coins} onChange={onChangeHandler} />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input type="number" placeholder="winner count" name="winnerCount" value={winnerCount} onChange={onChangeHandler} />
                </div>
                <div className="col">
                    <Select onSelect={onSelectHandler} name="consoleIndex" placeholder="console" value={consoleIndex} options={
                        consoles
                            ?.map((console: ConsoleDoc, index: number) => {
                                return <Option key={console.name} display={console.name.toUpperCase()} value={index} />
                            })
                    } />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Input type="datetime-local" placeholder="start at" onChange={onChangeHandler} name="startDateTime" />
                </div>
                <div className="col">
                    <Input type="datetime-local" placeholder="end at" onChange={onChangeHandler} name="endDateTime" />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Select onSelect={onSelectHandler} name="gameIndex" placeholder="game" value={gameIndex} options={
                        games
                            ?.filter(game => game.console === consoles[consoleIndex]?.name)
                            ?.map((game: GameDoc, index: number) => {
                                return <Option key={game.name} display={game.name} value={index} />
                            })
                    } />
                </div>
                <div className="col">
                    <Select onSelect={onSelectHandler} name="pIndex" placeholder="participants" value={pIndex} options={
                        games
                            ?.filter(game => game.console === consoles[consoleIndex]?.name)[gameIndex]
                            ?.participants
                            ?.map((p, index: number) => {
                                return <Option key={p} display={p} value={index} />
                            })
                    } />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Select onSelect={onSelectHandler} name="gIndex" placeholder="group" value={gIndex} options={
                        games
                            ?.filter(game => game.console === consoles[consoleIndex]?.name)[gameIndex]
                            ?.groups
                            ?.map((g, index: number) => {
                                return <Option key={g.name} display={`${g.name}-${g.participants}`} value={index} />
                            })
                    } />
                </div>
            </div>
            <div className="row">
                <ProgressButton size="large" text="Submit" type="whatsapp" onPress={async (_, next) => {
                    await doRequest();
                    next();
                }} />
            </div>
        </div>
    </SideLayout>
}

AddTournament.getInitialProps = async (ctx) => {
    const { data: consoles, errors: errorsA } = await serverRequest(ctx, { url: "/api/ugh/console/fetch/active", body: {}, method: "get" });
    const { data: games, errors: errorsB } = await serverRequest(ctx, { url: "/api/ugh/game/fetch/active", body: {}, method: "get" });
    const errors = [];
    if (errorsA) errors.push(...errorsA);
    if (errorsB) errors.push(...errorsB);
    return {
        consoles: consoles || [],
        games: games || [],
        errors
    };
}

export default AddTournament;