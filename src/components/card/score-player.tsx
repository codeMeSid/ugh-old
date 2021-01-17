import React, { useEffect, useState } from "react";
import DialogButton from "../button/dialog";
import ProgressButton from "../button/progress";
import FileInput from "../input/file";
import Input from "../input/input";
import { useRequest } from "../../hooks/use-request";
import { event } from "../../socket";
import IconDialogButton from "../button/icon-dialog";
import { RiTeamLine } from "react-icons/ri";
import ImageDialogButton from "../button/image-dialog";

const PlayerImg = require("../../public/asset/logo_icon.webp");
const TeamImg = require("../../public/asset/team_icon.webp");

const PlayerScoreCard = ({
  player,
  team,
  opponent,
  bracket,
  tournamentId,
}: {
  player: {
    profilePic?: string;
    ughId?: string;
    isCurrentUser: Boolean;
  };
  team: {
    score: number;
    hasScore: boolean;
    canUploadScore: boolean;
    updateScoreBy?: Date;
    canUploadProof: boolean;
    hasRaisedDispute: boolean;
    isWinner: boolean;
    hasProof: boolean;
    proof?: string;
    teamMates?: any;
  };
  opponent: {
    ughId?: string;
    score?: number;
    hasScore?: boolean;
    canRaiseDispute: boolean;
    raiseDisputeBy?: Date;
    hasRaisedDispute: boolean;
    canAcceptProof: boolean;
  };
  bracket: {
    regId: string;
    tournamentId: string;
    onError: any;
    wasDisputeRaised: boolean;
    hasWinner: boolean;
  };
  tournamentId: string;
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
    if (team.updateScoreBy && !stopTimer)
      setTimeout(
        () =>
          getTimer(
            team.updateScoreBy,
            () => {
              setEnableScoreUpload(true);
              stopTimer = true;
            },
            (val: any) => setScoreTimer(val)
          ),
        1000
      );
  }, [scoreTimer]);
  useEffect(() => {
    if (opponent.raiseDisputeBy && !stopTimer)
      setTimeout(
        () =>
          getTimer(
            opponent.raiseDisputeBy,
            () => {
              setEnableDisputeRaise(false);
              stopTimer = true;
            },
            (val) => setDisputeTimer(val)
          ),
        1000
      );
  }, [disputeTimer]);
  // // methods
  const onChangeHandler = (name, val) => {
    switch (name) {
      case "score":
        setRank(parseInt(val));
      case "proof":
        setProof(val);
    }
  };
  const getTimer = (date: Date, onSuccess: any, onUpdate: any) => {
    const sdt = new Date(date).getTime();
    const cdt = new Date().getTime();
    const msIn1Sec = 1000;
    const msIn1Min = msIn1Sec * 60;
    const msIn1Hour = msIn1Min * 60;
    const delta = sdt - cdt > 0 ? sdt - cdt : 0;
    const minsLeft = Math.floor((delta % msIn1Hour) / msIn1Min);
    const secondsLeft = Math.floor((delta % msIn1Min) / msIn1Sec);
    const diffTime = `${minsLeft < 10 ? `0${minsLeft}` : minsLeft}m ${
      secondsLeft < 10 ? `0${secondsLeft}` : secondsLeft
    }s`;
    if (minsLeft >= 0 && secondsLeft >= 0) {
      if (minsLeft === 0 && secondsLeft === 0) {
        if (onSuccess) onSuccess();
      }
      onUpdate(diffTime);
    }
  };
  // // requests
  const { doRequest: addScoreHandler } = useRequest({
    url: `/api/ugh/bracket/score/add/${bracket.regId}`,
    body: { score: rank || 0, tournamentId: bracket.tournamentId },
    method: "post",
    onError: bracket.onError,
    onSuccess: () =>
      event.bracketRankUpdate({
        by: player?.ughId,
        tournamentId,
        type: "score",
      }),
  });
  const { doRequest: addProofHandler } = useRequest({
    url: `/api/ugh/bracket/score/dispute/proof/${bracket.regId}`,
    body: { proof },
    method: "post",
    onError: bracket.onError,
    onSuccess: () =>
      event.bracketRankUpdate({
        by: player?.ughId,
        tournamentId,
        type: "proof",
      }),
  });
  const { doRequest: acceptProofHandler } = useRequest({
    url: `/api/ugh/bracket/score/dispute/accept/${bracket.regId}`,
    body: { accept: true, tournamentId: bracket.tournamentId },
    method: "post",
    onError: bracket.onError,
    onSuccess: () =>
      event.bracketRankUpdate({
        by: player?.ughId,
        tournamentId,
        type: "accept",
      }),
  });
  const { doRequest: raiseDisputeHandler } = useRequest({
    url: `/api/ugh/bracket/score/dispute/${bracket.regId}`,
    body: {},
    method: "post",
    onError: bracket.onError,
    onSuccess: () =>
      event.bracketRankUpdate({
        by: player?.ughId,
        on: opponent?.ughId,
        tournamentId,
        type: "dispute",
      }),
  });
  return (
    <>
      <div className="bracket__score__player">
        {team?.teamMates?.length > 0 && (
          <div className="bracket__score__team">
            <ImageDialogButton
              ImageLink={TeamImg}
              imageStyle={{
                borderRadius: "50%",
                backgroundColor: "red",
                width: 22,
                height: 22,
              }}
              style={{
                minWidth: 360,
                position: "fixed",
                top: "40%",
                left: "50%",
                transform: "translate(-50%,-50%)",
              }}
            >
              <div style={{ textAlign: "center", fontSize: 28 }}>Team Info</div>
              <table>
                <tr>
                  <td>InGame ID</td>
                  <td>Email</td>
                </tr>
                {team?.teamMates?.map((t: any) => {
                  return (
                    <tr key={Math.random()}>
                      <td>{t.name}</td>
                      <td>{t.email || "-"}</td>
                    </tr>
                  );
                })}
              </table>
            </ImageDialogButton>
          </div>
        )}
        <div
          className={`bracket__score__image ${player.profilePic ? "" : "none"}`}
          style={{ backgroundImage: `url(${player.profilePic || PlayerImg})` }}
        />
        <div className="bracket__score__name">
          <div>{player.ughId}</div>
        </div>
        {team.hasScore && (
          <div className="bracket__score__value">
            <span className="bracket__score__value--text">score</span>
            <span className="bracket__score__value--number">{team.score}</span>
          </div>
        )}
        {bracket.hasWinner ? (
          <div
            className={`bracket__score__winner bracket__score__winner--${
              team.isWinner ? "winner" : "lost"
            }`}
          >
            {team.isWinner ? "WON" : "LOST"}
          </div>
        ) : (
          <>
            {bracket.wasDisputeRaised && (
              <div
                style={{
                  fontSize: "1.6rem",
                  textAlign: "center",
                  wordBreak: "break-all",
                  textTransform: "capitalize",
                  color: "white",
                  margin: ".5rem 0",
                }}
              >
                <div>{opponent.hasRaisedDispute && "dispute was raised"}</div>
              </div>
            )}
            {team.canUploadProof && (
              <div>
                <DialogButton
                  title="Upload Proof"
                  style={{ position: "fixed" }}
                  onAction={addProofHandler}
                  fullButton
                >
                  <FileInput
                    name="proof"
                    placeholder="upload proof"
                    onChange={onChangeHandler}
                    showImage
                  />
                </DialogButton>
              </div>
            )}
            {team.canUploadScore && (
              <div style={{ margin: "1rem 0" }}>
                <DialogButton
                  disabled={!enableScoreUpload}
                  title={
                    enableScoreUpload
                      ? "Update Score"
                      : scoreTimer
                      ? scoreTimer
                      : "Waiting..."
                  }
                  style={{ position: "fixed" }}
                  onAction={async () => {
                    await addScoreHandler();
                    if (opponent.hasScore && rank === opponent.score) {
                      raiseDisputeHandler();
                    }
                  }}
                  fullButton
                >
                  <Input
                    placeholder="score"
                    name="score"
                    value={rank}
                    type="number"
                    onChange={onChangeHandler}
                  />
                  {opponent.hasScore && opponent.score === rank && (
                    <p style={{ fontSize: 16, color: "red" }}>
                      *If both teams have same score, dispute will be raised.
                    </p>
                  )}
                </DialogButton>
              </div>
            )}
            {opponent.canRaiseDispute && (
              <>
                {enableDisputeRaise && (
                  <div className="bracket__score__timer">{disputeTimer} to</div>
                )}
                <DialogButton
                  title="Raise Dispute"
                  size="large"
                  type="youtube"
                  disabled={!enableDisputeRaise}
                  onAction={raiseDisputeHandler}
                  fullButton
                  style={{
                    minWidth: 400,
                    maxWidth: 600,
                  }}
                >
                  <div
                    style={{
                      fontSize: 20,
                      wordBreak: "break-word",
                      textAlign: "center",
                    }}
                  >
                    <p style={{ color: "red" }}>
                      Are you sure want to raise Dispute?
                    </p>
                    <p style={{ color: "red", margin: "10px 0" }}>
                      If you raise a wrong dispute, your account may get banned.
                    </p>
                  </div>
                </DialogButton>
              </>
            )}
            {team.hasProof && (
              <>
                <div className="bracket__score__proof">
                  <a
                    href={team.proof}
                    className="bracket__score__proof--image"
                    target="_blank"
                  >
                    <img src={team.proof} alt="UGH PROOF" />
                  </a>
                  <a href={team.proof} className="bracket__score__proof--title">
                    click to view
                  </a>
                </div>
                {opponent.canAcceptProof && (
                  <div className="bracket__score__accept">
                    <div>
                      <ProgressButton
                        text="Accept"
                        type="link"
                        style={{ width: "100%" }}
                        onPress={async (_, next) => {
                          await acceptProofHandler();
                          next();
                        }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
export default PlayerScoreCard;
