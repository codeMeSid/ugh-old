import Button from "../components/button/main"
import Input from '../components/input/input';
import { serverRequest } from '../hooks/server-request';
import { GameDoc } from '../../server/models/game';
import Select from '../components/input/select';
import Option from '../components/input/option';
import { ConsoleDoc } from '../../server/models/console';
import { useState } from "react";
import { useRequest } from "../hooks/use-request";
import Router from 'next/router';
import MainLayout from "../components/layout/mainlayout";
import DialogButton from "../components/button/dialog";

const AddTournament = ({ gs, cs, errors }:
    { gs: Array<GameDoc>, cs: Array<ConsoleDoc>, errors: any }) => {
    const [wc, setWc] = useState(1);
    const [messages, setMessages] = useState(errors);
    const [games] = useState(gs);
    const [game, setGame] = useState(0);
    const [participants, setParticipants] = useState(0);
    const [group, setGroup] = useState(0);
    const [consoles] = useState(cs);
    const [console, setConsole] = useState(0);
    const [coins, setCoins] = useState(10);
    const [name, setName] = useState("");
    const [sdt, setSdt] = useState("");
    const [edt, setEdt] = useState("");


    const { doRequest } = useRequest({
        url: "/api/ugh/tournament/add",
        body: {
            name,
            coins,
            winnerCount: wc,
            startDateTime: new Date(sdt),
            endDateTime: new Date(edt),
            game: games[game].id,
            playerCount: games[game].participants[participants],
            group: games[game].groups[group]
        },
        method: "post",
        onSuccess: () => Router.replace("/my-tournament"),
        onError: (errors) => setMessages(errors)
    });
    const onChangeHandler = (name: String, val: any) => {
        switch (name) {
            case 'name': return setName(val);
            case 'coins':
                if (val > 0) return setCoins(parseInt(val));
                else return;
            case 'winnerCount':
                if (val > 0) return setWc(parseInt(val));
                else return;
            case 'startDateTime': return setSdt(val)
            case 'endDateTime': return setEdt(val);
        }
    }
    const onSelectHandler = (e) => {
        const name = e.currentTarget.name;
        const val = e.currentTarget.value;
        switch (name) {
            case "console":
                setConsole(parseInt(val));
                setGame(0);
                setParticipants(0);
                setGroup(0);
                break;
            case "game":
                setGame(parseInt(val));
                setParticipants(0);
                setGroup(0);
                break;
            case 'participants':
                setParticipants(parseInt(val));
                setGroup(0);
                break;
            case "group":
                setGroup(parseInt(val));
                break;
        }
    }
    return <MainLayout messages={messages}>
        <div className="detail" style={{ padding: "2rem" }}>
            <h1>Add Tournament</h1>
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
                    <Input type="number" placeholder="winner count" name="winnerCount" value={wc} onChange={onChangeHandler} />
                </div>
                <div className="col">
                    <Select name="console" onSelect={onSelectHandler} value={console} placeholder="console" options={
                        cs.map((c, index) => <Option key={c.name} display={c.name.toUpperCase()} value={index} />)
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
                    <Select onSelect={onSelectHandler} name="game" placeholder="game" value={game} options={
                        games
                            ?.filter(game => game.console === consoles[console]?.name)
                            ?.map((g: GameDoc, index: number) => <Option key={g.name} display={g.name} value={index} />)
                    } />
                </div>
                <div className="col">
                    <Select onSelect={onSelectHandler} name="participants" placeholder="participants" value={participants} options={
                        games[game].participants.map(
                            (p, index) => <Option key={p} display={p} value={index} />)
                    } />
                </div>
            </div>
            <div className="row">
                <div className="col">
                    <Select onSelect={onSelectHandler} name="group" placeholder="group" value={group} options={
                        games[game]?.groups?.map((g, index) => <Option key={g.name} display={`${g.name}-${g.participants}`} value={index} />)
                    } />
                </div>
            </div>
            <div className="row">
                <DialogButton fullButton title="Submit" onAction={doRequest} style={{ top: "20%", position: "fixed" }}>
                    <div style={{ margin: "2rem auto", fontSize: "2rem", minWidth: "40rem", maxWidth: "50rem" }}>
                        Creating tournament will cost you {coins * (games[game]?.groups[group]?.participants || 1)} coins from your account
                    </div>
                </DialogButton>
            </div>
        </div>
    </MainLayout>
}

AddTournament.getInitialProps = async (ctx) => {
    const { data: consoles, errors: errorsA } = await serverRequest(ctx, { url: "/api/ugh/console/fetch/active", body: {}, method: "get" });
    const { data: games, errors: errorsB } = await serverRequest(ctx, { url: "/api/ugh/game/fetch/active", body: {}, method: "get" });
    const errors = [];
    if (errorsA) errors.push(...errorsA);
    if (errorsB) errors.push(...errorsB);
    return {
        cs: consoles || [],
        gs: games || [],
        errors
    };
}

export default AddTournament;