import { useEffect, useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";
import { useRequest } from "../../hooks/use-request";
import { numberPostion } from "../../public/number-postion";
import DialogButton from "../button/dialog";
import ProgressButton from "../button/progress";
import FileInput from "../input/file";
import Input from "../input/input";
import Router from 'next/router';

const BracketRankCard = ({ userHasUploadedScore, currentUser, bracket, onError, tournamentId }: { userHasUploadedScore: boolean, currentUser: any, bracket: BracketDoc, onError: any, tournamentId: string }) => {
    const isUserBracket = JSON.stringify(bracket.teamA.user.id) === JSON.stringify(currentUser.id);
    const canUpdateRank = isUserBracket && bracket.teamA.score === 0;
    const canRaiseDispute = userHasUploadedScore && bracket.teamA.score !== 0 && !bracket.teamB.hasRaisedDispute;
    const disputeHasBeenRaised = userHasUploadedScore && bracket.teamB.hasRaisedDispute;
    const canUploadProof = userHasUploadedScore && bracket.teamB.hasRaisedDispute && bracket.teamA.score !== 0 && !bracket.teamA.uploadUrl && isUserBracket;
    const isProofAvailable = (JSON.stringify(bracket?.teamB?.user?.id) === JSON.stringify(currentUser?.id) || isUserBracket) && bracket.teamA.uploadUrl;
    const canAcceptProof = JSON.stringify(bracket?.teamB?.user?.id) === JSON.stringify(currentUser?.id) && userHasUploadedScore && bracket.teamB.hasRaisedDispute && bracket.teamA.score !== 0;
    let stopTimer = false;
    // states
    const [utimer, setutimer] = useState("");
    const [ptimer, setptimer] = useState("");
    const [updateRank, setUpdateRank] = useState(false);
    const [raiseDispute, setRaiseDispute] = useState(true);
    const [rank, setRank] = useState(0);
    const [proof, setProof] = useState("");
    // effects
    useEffect(() => {
        if (bracket.uploadBy && !stopTimer)
            setTimeout(() => getuTimer(bracket.uploadBy, () => setUpdateRank(true)), 1000);
    }, [utimer]);
    useEffect(() => {
        if (bracket.updateBy && !stopTimer)
            setTimeout(() => getpTimer(bracket.updateBy, () => setRaiseDispute(false)), 1000);
    }, [ptimer]);
    // methods
    const getuTimer = (date: Date, onSuccess: any) => {
        const sdt = new Date(date).getTime();
        const cdt = new Date().getTime();
        const msIn1Sec = 1000
        const msIn1Min = msIn1Sec * 60;
        const msIn1Hour = msIn1Min * 60;
        const delta = sdt - cdt > 0 ? sdt - cdt : 0;
        const minsLeft = Math.floor((delta % (msIn1Hour)) / (msIn1Min));
        const secondsLeft = Math.floor((delta % (msIn1Min)) / msIn1Sec);
        const diffTime = `${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`
        if (minsLeft >= 0 && secondsLeft >= 0) {
            if (minsLeft === 0 && secondsLeft === 0) {
                if (onSuccess) onSuccess();
                stopTimer = true;
            }
            setutimer(diffTime);
        }
    }
    const getpTimer = (date: Date, onSuccess: any) => {
        const sdt = new Date(date).getTime();
        const cdt = new Date().getTime();
        const msIn1Sec = 1000
        const msIn1Min = msIn1Sec * 60;
        const msIn1Hour = msIn1Min * 60;
        const delta = sdt - cdt > 0 ? sdt - cdt : 0;
        const minsLeft = Math.floor((delta % (msIn1Hour)) / (msIn1Min));
        const secondsLeft = Math.floor((delta % (msIn1Min)) / msIn1Sec);
        const diffTime = `${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft}s`
        if (minsLeft >= 0 && secondsLeft >= 0) {
            if (minsLeft === 0 && secondsLeft === 0) {
                if (onSuccess) onSuccess();
                stopTimer = true;
            }
            setptimer(diffTime);
        }
    }
    // requests
    const { doRequest: updateScoreHandler } = useRequest({
        url: `/api/ugh/bracket/rank/add/${bracket.regId}`,
        body: { rank, tournamentId },
        method: "post",
        onSuccess: Router.reload,
        onError
    });

    const { doRequest: disputeHandler } = useRequest({
        url: `/api/ugh/bracket/rank/dispute/${bracket.regId}`,
        body: {},
        method: "get",
        onSuccess: Router.reload,
        onError
    });
    const { doRequest: proofHandler } = useRequest({
        url: `/api/ugh/bracket/rank/dispute/proof/${bracket.regId}`,
        body: { proof },
        method: "post",
        onSuccess: Router.reload,
        onError
    });
    const { doRequest: proofAcceptHandler } = useRequest({
        url: `/api/ugh/bracket/rank/dispute/accept/${bracket.regId}`,
        body: { accept: true, tournamentId },
        method: "post",
        onSuccess: Router.reload,
        onError
    });
    return <div className={`bracket ${isUserBracket ? "active" : ""}`}>
        <div>Final Round</div>
        <div className="bracket__profile" style={{ backgroundImage: `url(${bracket.teamA.user?.uploadUrl})` }} />
        <div className="bracket__ughId">{bracket.teamA.user.ughId} {isUserBracket && "(YOU)"}</div>
        <div className="bracket__rank">
            <span className="bracket__rank__title">Rank</span>
            <span className="bracket__rank__value">{bracket.teamA.score || 0}</span>
            <span className="bracket__rank__postion">{numberPostion(bracket.teamA.score || 0)}</span>
        </div>
        {bracket.winner && <div className="bracket__winner">Completed</div>}
        {!bracket.winner && <div className="bracket__button">
            {
                canUpdateRank && <DialogButton disabled={!updateRank} type={"link"} title={updateRank ? "Update Rank" : `enable in ${utimer}`} onAction={updateScoreHandler} style={{ position: "fixed" }} fullButton>
                    <Input placeholder="Upload Rank" value={rank} onChange={(n, v) => setRank(parseInt(v))} type="number" />
                </DialogButton>
            }
            {
                canRaiseDispute && <div className="bracket__timer">
                    <div className="bracket__timer__value">{ptimer} left to</div>
                    {isUserBracket
                        ? <div style={{ marginTop: "1rem" }}>Raise Dispute</div>
                        : <ProgressButton disabled={!raiseDispute} type={raiseDispute ? "youtube" : "disabled"} size="large" text="Raise Dispute" onPress={async (_, next) => {
                            await disputeHandler();
                            next();
                        }} />}
                </div>
            }
            {
                disputeHasBeenRaised && <div className="bracket__dispute">{bracket.teamB.user?.ughId?.toUpperCase()} has raised dispute</div>
            }
            {
                canUploadProof && <div style={{ display: "inline-block" }}>
                    <DialogButton style={{ minWidth: "40rem", position: "fixed" }} type="github" title="Upload Proof" onAction={proofHandler} fullButton>
                        <FileInput name="proof" placeholder="Rank Proof" onChange={(n, v) => setProof(v)} showImage />
                    </DialogButton>
                </div>
            }
            {
                isProofAvailable && <div className="bracket__proof__container">
                    <a className="bracket__proof" href={bracket?.teamA?.uploadUrl} target="_blank">
                        <div className="bracket__proof__text">Click to View</div>
                        <img src={bracket.teamA.uploadUrl} alt="UGH dispute proof" className="bracket__proof__image" />
                    </a>
                    {canAcceptProof && <div>
                        <ProgressButton size="large" type="whatsapp" text="Accept Proof" onPress={async (_, next) => {
                            await proofAcceptHandler();
                            next();
                        }} />
                        <ProgressButton style={{ marginTop: "1rem" }} size="large" type="facebook" text="Chat with Admin" />
                    </div>
                    }
                </div>
            }
        </div>}
    </div>
}

export default BracketRankCard;