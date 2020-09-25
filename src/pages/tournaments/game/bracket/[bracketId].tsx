import { useEffect, useState } from "react";
import Router from 'next/router';
import { BracketDoc } from "../../../../../server/models/bracket";
import Button from "../../../../components/button/main";
import ProgressButton from "../../../../components/button/progress";
import Input from "../../../../components/input/input";
import MainLayout from "../../../../components/layout/mainlayout";
import { serverRequest } from "../../../../hooks/server-request";
import { useRequest } from "../../../../hooks/use-request";

const BracketDetail = ({ match, errors, currentUser }: { match: BracketDoc, errors: Array<any>, currentUser: any }) => {
    const [messages, setMessages] = useState(errors);
    const [bracket, setBracket] = useState(match);
    const [timer, setTimer] = useState("");
    const [teamA, setTeamA] = useState(0);
    const [teamB, setTeamB] = useState(0);
    let stopTimer = false;

    useEffect(() => {
        if (bracket?.updateBy && !stopTimer) {
            setTimeout(getTimer, 1000);
        }
    }, [timer])

    const { doRequest: doRequestA } = useRequest({
        url: `/api/ugh/tournament/update/bracket/${bracket?.regId}`,
        body: { teamA },
        method: "put",
        onSuccess: (data) => setBracket(data),
        onError: (errors) => setMessages(errors)
    });
    const { doRequest: doRequestB } = useRequest({
        url: `/api/ugh/tournament/update/bracket/${bracket?.regId}`,
        body: { teamB },
        method: "put",
        onSuccess: (data) => setBracket(data),
        onError: (errors) => setMessages(errors)
    });
    const onChangeHandler = (name: string, val: any) => {
        switch (name) {
            case "teamA": return setTeamA(parseInt(val));
            case "teamB": return setTeamB(parseInt(val));
        }
    }
    const getTimer = () => {
        const sdt = new Date(bracket?.updateBy).getTime();
        const cdt = new Date().getTime();
        const msIn1Sec = 1000
        const msIn1Min = msIn1Sec * 60;
        const msIn1Hour = msIn1Min * 60;
        const msIn1Day = msIn1Hour * 24;
        const delta = sdt - cdt > 0 ? sdt - cdt : 0;
        const daysLeft = Math.floor(delta / msIn1Day);
        const hoursLeft = Math.floor((delta % (msIn1Day)) / (msIn1Hour));
        const minsLeft = Math.floor((delta % (msIn1Hour)) / (msIn1Min));
        const secondsLeft = Math.floor((delta % (msIn1Min)) / msIn1Sec);
        const diffTime = `${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`
        if (daysLeft >= 0 && hoursLeft >= 0 && minsLeft >= 0 && secondsLeft >= 0) {
            if (daysLeft === 0 && hoursLeft === 0 && minsLeft === 0 && secondsLeft === 0) {
                stopTimer = true;
                setTimer("Refresh Page");
                return;
            }
            setTimer(diffTime);
        }
    }
    const getTimerValue = () => {
        const winner = bracket?.winner;
        const updateBy = bracket?.updateBy;
        const round = bracket?.round;
        if (winner) return `winner: ${winner}`;
        else if (updateBy) return timer;
        else if (!winner && !updateBy) return `round ${round}`;
        else return "";
    }
    const getInputA = () => {
        const score = bracket?.teamA?.score;
        const userA = JSON.stringify(bracket?.teamA?.user?.id);
        const userId = JSON.stringify(currentUser?.id);
        if (score || userA !== userId) return (
            <div>
                <div className="bracket__detail__input__score">{score || "TBD"}</div>
                <div className="bracket__detail__input__score__title">Score/Rank</div>
            </div>)
        else return (<div>
            <Input style={{ color: "white" }} placeholder="score" name="teamA" type="number" value={teamA} onChange={onChangeHandler} />
            <div style={{ textAlign: "right" }}>
                <ProgressButton text="SUBMIT" type="link" size="large" onPress={async (_, next) => {
                    await doRequestA();
                    next();
                }} />
            </div>
        </div>);
    }
    const getInputB = () => {
        const score = bracket?.teamB?.score;
        const userB = JSON.stringify(bracket?.teamB?.user?.id);
        const userId = JSON.stringify(currentUser?.id);
        if (score || userB !== userId) return (<div>
            <div className="bracket__detail__input__score">{bracket?.teamB?.score || "TBD"}</div>
            <div className="bracket__detail__input__score__title">Score/Rank</div>
        </div>
        );
        else return (<div>
            <Input style={{ color: "white" }} placeholder="score" name="teamB" type="number" value={teamB} onChange={onChangeHandler} />
            <div>
                <ProgressButton text="SUBMIT" type="link" size="large" onPress={async (_, next) => {
                    await doRequestB();
                    next();
                }} />
            </div>
        </div>);
    }
    const getUser = (team: string) => (<div>
        <div className="bracket__player" style={{ backgroundImage: `url(${bracket[team]?.user?.uploadUrl})` }} />
        <div className="bracket__player__name">{bracket[team]?.user?.ughId}</div>
    </div>);

    return <MainLayout messages={messages}>
        <div className="bracket__detail">
            <div className="bracket__detail__play bracket__detail__play--1">
                {getUser("teamA")}
                <div className="bracket__detail__input">
                    {getInputA()}
                </div>
            </div>
            <div className="bracket__detail__timer">
                {getTimerValue()}
            </div>
            <div className="bracket__detail__play bracket__detail__play--2">
                {getUser("teamB")}
                <div className="bracket__detail__input bracket__detail__input--1">
                    {getInputB()}
                </div>
            </div>
        </div>
    </MainLayout>
}
BracketDetail.getInitialProps = async (ctx) => {
    const { bracketId } = ctx.query;
    const { data, errors } = await serverRequest(ctx, { url: `/api/ugh/tournament/fetch/bracket/detail/${bracketId}`, body: {}, method: "get" });
    return { match: data, errors: errors || [] }
}

export default BracketDetail;