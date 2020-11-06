import React, { useEffect, useState } from "react";
import DialogButton from "../button/dialog";
import ProgressButton from "../button/progress";
import FileInput from "../input/file";
import Input from "../input/input";
import { useRequest } from "../../hooks/use-request";
import Router from 'next/router';

const PlayerScoreCard = ({
    player, team, opponent, bracket
}: {
    player: {
        profilePic?: string,
        ughId?: string,
        //     isCurrentUser,
    },
    team: {
        score: number,
        hasScore: boolean
        canUploadScore: boolean,
        updateScoreBy?: Date,
        canUploadProof: boolean,
        hasRaisedDispute: boolean
        isWinner: boolean,
        hasProof: boolean
        proof?: string
    },
    opponent: {
        canRaiseDispute: boolean,
        raiseDisputeBy?: Date
        hasRaisedDispute: boolean,
        canAcceptProof: boolean,
    },
    bracket: {
        regId: string,
        tournamentId: string,
        onError: any,
        wasDisputeRaised: boolean
        hasWinner: boolean,
    },
}) => {

    const [scoreTimer, setScoreTimer] = useState("");
    const [disputeTimer, setDisputeTimer] = useState("");
    const [enableScoreUpload, setEnableScoreUpload] = useState(false);
    const [enableDisputeRaise, setEnableDisputeRaise] = useState(true);
    const [rank, setRank] = useState(0);
    const [proof, setProof] = useState("");
    let stopTimer = false;
    // // effects
    useEffect(() => {
        if (team.updateScoreBy && !stopTimer) setTimeout(() =>
            getTimer(team.updateScoreBy, () => {
                setEnableScoreUpload(true);
                stopTimer = true;
            }, (val: any) => setScoreTimer(val)),
            1000);
    }, [scoreTimer])
    useEffect(() => {
        if (opponent.raiseDisputeBy && !stopTimer) setTimeout(() =>
            getTimer(opponent.raiseDisputeBy, () => {
                setEnableDisputeRaise(false);
                stopTimer = true;
            }, (val) => setDisputeTimer(val)),
            1000);
    }, [disputeTimer])
    // // methods 
    const onChangeHandler = (name, val) => {
        switch (name) {
            case "score": setRank(parseInt(val || -1));
            case "proof": setProof(val)
        }
    }
    const getTimer = (date: Date, onSuccess: any, onUpdate: any) => {
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
                if (onSuccess) onSuccess()
            }
            onUpdate(diffTime);
        }
    }
    // // requests 
    const { doRequest: addScoreHandler } = useRequest({
        url: `/api/ugh/bracket/score/add/${bracket.regId}`,
        body: { score: rank, tournamentId: bracket.tournamentId },
        method: "post",
        onError: bracket.onError,
        onSuccess: Router.reload
    });
    const { doRequest: addProofHandler } = useRequest({
        url: `/api/ugh/bracket/score/dispute/proof/${bracket.regId}`,
        body: { proof },
        method: "post",
        onError: bracket.onError,
        onSuccess: Router.reload
    });
    const { doRequest: acceptProofHandler } = useRequest({
        url: `/api/ugh/bracket/score/dispute/accept/${bracket.regId}`,
        body: { accept: true, tournamentId: bracket.tournamentId },
        method: "post",
        onError: bracket.onError,
        onSuccess: Router.reload
    });
    const { doRequest: raiseDisputeHandler } = useRequest({
        url: `/api/ugh/bracket/score/dispute/${bracket.regId}`,
        body: {},
        method: "post",
        onError: bracket.onError,
        onSuccess: Router.reload
    });
    return <>
        <div className="bracket__score__player">
            <div className="bracket__score__image" style={{ backgroundImage: `url(${player.profilePic})` }} />
            <div className="bracket__score__name">
                <div>{player.ughId}</div>
            </div>
            {team.hasScore && <div className="bracket__score__value">
                <span className="bracket__score__value--text">score</span>
                <span className="bracket__score__value--number">{team.score}</span>
            </div>
            }
            {
                bracket.hasWinner
                    ? <div className={`bracket__score__winner bracket__score__winner--${team.isWinner ? "winner" : "lost"}`}>
                        {team.isWinner ? "WON" : "LOST"}
                    </div>
                    : <>
                        {
                            bracket.wasDisputeRaised && <div style={{
                                fontSize: "1.6rem",
                                textAlign: "center",
                                wordBreak: "break-all",
                                textTransform: "capitalize",
                                color: "white",
                                margin: ".5rem 0"
                            }}>
                                <div>{opponent.hasRaisedDispute && "opponent "}</div>
                                <div>{team.hasRaisedDispute && "You "}</div>
                    raised dispute
                </div>
                        }
                        {
                            team.canUploadProof && <div>
                                <DialogButton title="Upload Proof" style={{ position: "fixed" }} onAction={addProofHandler} fullButton>
                                    <FileInput name="proof" placeholder="upload proof" onChange={onChangeHandler} showImage />
                                </DialogButton>
                            </div>
                        }
                        {team.canUploadScore && <div style={{ margin: "1rem 0" }}>
                            <DialogButton disabled={!enableScoreUpload} title={enableScoreUpload ? "Update Score" : scoreTimer} style={{ position: "fixed" }} onAction={addScoreHandler} fullButton>
                                <Input placeholder="score" name="score" value={rank} type="number" onChange={onChangeHandler} />
                            </DialogButton>
                        </div>}
                        {opponent.canRaiseDispute && <>
                            {enableDisputeRaise && <div className="bracket__score__timer">{disputeTimer} to</div>}
                            <ProgressButton disabled={!enableDisputeRaise} text="Raise Dispute" type="github" style={{ width: "100%" }} onPress={async (_, next) => {
                                await raiseDisputeHandler();
                                next();
                            }} />
                        </>}
                        {
                            team.hasProof && <>
                                <div className="bracket__score__proof">
                                    <a href={team.proof} className="bracket__score__proof--image" target="_blank">
                                        <img src={team.proof} alt="UGH PROOF" />
                                    </a>
                                    <a href={team.proof} className="bracket__score__proof--title">click to view</a>
                                </div>
                                {
                                    opponent.canAcceptProof && <div className="bracket__score__accept">
                                        <div >
                                            <ProgressButton text="Accept" type="link" style={{ width: "100%" }} onPress={async (_, next) => {
                                                await acceptProofHandler();
                                                next();
                                            }} />
                                        </div>
                                    </div>
                                }
                            </>}
                    </>
            }

        </div>
    </>
}
export default PlayerScoreCard;