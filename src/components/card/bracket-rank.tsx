import { useEffect, useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";
import { useRequest } from "../../hooks/use-request";
import { numberPostion } from "../../public/number-postion";
import DialogButton from "../button/dialog";
import ProgressButton from "../button/progress";
import FileInput from "../input/file";
import Input from "../input/input";
import { DQ } from "../../../server/utils/enum/dq";
import { event } from "../../socket";

const PlayerImg = require("../../public/asset/logo_icon.webp");

const BracketRankCard = ({
  userHasUploadedScore,
  currentUser,
  bracket,
  onError,
  tournamentId,
}: {
  userHasUploadedScore: boolean;
  currentUser: any;
  bracket: BracketDoc;
  onError: any;
  tournamentId: string;
}) => {
  const isUserBracket =
    JSON.stringify(bracket.teamA.user.id) === JSON.stringify(currentUser.id);
  const result =
    bracket?.winner === DQ.DisputeLost ||
    bracket?.winner === DQ.ScoreNotUploaded ||
    bracket?.winner === DQ.AdminDQ
      ? "Disqualified"
      : "Accepted";
  const hasWinner = !!bracket?.winner;
  const hasScore = bracket?.teamA?.score > 0;
  const canUpdateRank = isUserBracket && !hasScore;
  const canRaiseDispute =
    userHasUploadedScore &&
    hasScore &&
    !bracket.teamB.hasRaisedDispute &&
    !isUserBracket;
  const disputeHasBeenRaised =
    userHasUploadedScore && bracket.teamB.hasRaisedDispute;
  const canUploadProof =
    userHasUploadedScore &&
    bracket.teamB.hasRaisedDispute &&
    bracket.teamA.score !== 0 &&
    !bracket.teamA.uploadUrl &&
    isUserBracket;
  const isProofAvailable =
    (JSON.stringify(bracket?.teamB?.user?.id) ===
      JSON.stringify(currentUser?.id) ||
      isUserBracket) &&
    bracket.teamA.uploadUrl;
  const canAcceptProof =
    JSON.stringify(bracket?.teamB?.user?.id) ===
      JSON.stringify(currentUser?.id) &&
    userHasUploadedScore &&
    bracket.teamB.hasRaisedDispute &&
    bracket.teamA.score !== 0 &&
    bracket.teamA.uploadUrl;
  let stopTimer = false;
  // states
  const [utimer, setutimer] = useState("");
  const [ptimer, setptimer] = useState("");
  const [updateRank, setUpdateRank] = useState(false);
  const [raiseDispute, setRaiseDispute] = useState(true);
  const [rank, setRank] = useState(1);
  const [proof, setProof] = useState("");
  // function
  const onChangeHandler = (name, val) => {
    switch (name) {
      case "rank":
        return setRank(val);
      case "proof":
        return setProof(val);
    }
  };
  // effects
  useEffect(() => {
    if (bracket.uploadBy && !stopTimer)
      setTimeout(
        () => getuTimer(bracket.uploadBy, () => setUpdateRank(true)),
        1000
      );
  }, [utimer]);
  useEffect(() => {
    if (bracket.updateBy && !stopTimer)
      setTimeout(
        () => getpTimer(bracket.updateBy, () => setRaiseDispute(false)),
        1000
      );
  }, [ptimer]);
  // methods
  const getuTimer = (date: Date, onSuccess: any) => {
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
        stopTimer = true;
      }
      setutimer(diffTime);
    }
  };
  const getpTimer = (date: Date, onSuccess: any) => {
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
        stopTimer = true;
      }
      setptimer(diffTime);
    }
  };
  const getReason = () => {
    switch (bracket?.winner) {
      case DQ.ScoreNotUploaded:
        return (
          <div className="bracket__rank__reason">
            <div className="bracket__rank__title">reason</div>
            <div className="bracket__rank__value">Rank not uploaded</div>
          </div>
        );
      case DQ.DisputeLost:
        return (
          <div className="bracket__rank__reason">
            <div className="bracket__rank__reason__title">reason</div>
            <div className="bracket__rank__reason__value">dispute lost</div>
          </div>
        );
      case DQ.AdminDQ:
        return (
          <div className="bracket__rank__reason">
            <div className="bracket__rank__reason__title">reason</div>
            <div className="bracket__rank__reason__value">
              admin disqualification
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // requests
  const { doRequest: updateScoreHandler } = useRequest({
    url: `/api/ugh/bracket/rank/add/${bracket?.regId}`,
    body: { rank, tournamentId },
    method: "post",
    onSuccess: (bracketId) => {
      event.bracketRankUpdate({
        by: currentUser?.ughId,
        type: "score",
        tournamentId,
      });
      if (bracketId) {
        const { doRequest: disputeHandler } = useRequest({
          url: `/api/ugh/bracket/rank/dispute/${bracketId}`,
          body: {},
          method: "get",
          onSuccess: ({ disputeBy: by, disputeOn: on }) =>
            event.bracketRankUpdate({ by, on, type: "dispute", tournamentId }),
          onError,
        });
        disputeHandler();
      }
    },
    onError,
  });

  const { doRequest: disputeHandler } = useRequest({
    url: `/api/ugh/bracket/rank/dispute/${bracket.regId}`,
    body: {},
    method: "get",
    onSuccess: ({ disputeBy: by, disputeOn: on }) =>
      event.bracketRankUpdate({ by, on, type: "dispute", tournamentId }),
    onError,
  });
  const { doRequest: proofHandler } = useRequest({
    url: `/api/ugh/bracket/rank/dispute/proof/${bracket.regId}`,
    body: { proof },
    method: "post",
    onSuccess: () =>
      event.bracketRankUpdate({
        by: currentUser?.ughId,
        type: "proof",
        tournamentId,
      }),
    onError,
  });
  const { doRequest: proofAcceptHandler } = useRequest({
    url: `/api/ugh/bracket/rank/dispute/accept/${bracket.regId}`,
    body: { accept: true, tournamentId },
    method: "post",
    onSuccess: () =>
      event.bracketRankUpdate({
        by: currentUser?.ughId,
        type: "accept",
        tournamentId,
      }),
    onError,
  });
  return (
    <div className="bracket__rank">
      <div
        className={`bracket__rank__profile ${
          bracket.teamA.user?.uploadUrl ? "" : "none"
        }`}
        style={{
          backgroundImage: `url(${bracket.teamA.user?.uploadUrl || PlayerImg})`,
        }}
      />
      <div className="bracket__rank__ughId">
        {bracket.teamA.user.ughId} {isUserBracket && "(YOU)"}
      </div>
      {hasScore && (
        <div className="bracket__rank__score">
          <span className="bracket__rank__score--title">rank</span>
          <span className="bracket__rank__score--value">
            {bracket.teamA.score || 0}
          </span>
          <span className="bracket__rank__score--position">
            {numberPostion(bracket.teamA.score || 0)}
          </span>
        </div>
      )}
      {hasWinner && getReason()}
      {hasWinner ? (
        <div
          className={`bracket__rank__result ${
            result === "Accepted" ? "active" : ""
          }`}
        >
          {result}
        </div>
      ) : (
        <>
          {canUpdateRank && (
            <div style={{ marginTop: 10 }}>
              <DialogButton
                disabled={!updateRank}
                type={"link"}
                title={updateRank ? "Update Rank" : utimer}
                onAction={updateScoreHandler}
                style={{ position: "fixed" }}
                fullButton
              >
                <Input
                  placeholder="Upload Rank"
                  type="number"
                  value={rank}
                  name="rank"
                  onChange={onChangeHandler}
                />
                <p style={{ fontSize: 16, color: "red" }}>
                  *If any other player has same rank, dispute will be raised.
                </p>
              </DialogButton>
            </div>
          )}
          {canRaiseDispute && (
            <>
              <div
                style={{ textAlign: "center", fontSize: 18, color: "white" }}
              >
                {ptimer} to
              </div>
              <div
                style={{
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  marginTop: 15,
                }}
              >
                <DialogButton
                  title="Raise Dispute"
                  size="large"
                  type="youtube"
                  disabled={!raiseDispute}
                  onAction={disputeHandler}
                  buttonStyle={{ display: "block" }}
                  style={{ minWidth: 400, maxWidth: 600, fontSize: 20 }}
                  fullButton
                >
                  <p style={{ color: "red" }}>
                    Are you sure want to raise Dispute?
                  </p>
                  <p style={{ color: "red", marginBottom: 10 }}>
                    If you raise a wrong dispute your account may get banned.
                  </p>
                </DialogButton>
              </div>
            </>
          )}
          {disputeHasBeenRaised && (
            <div className="bracket__rank__dispute">
              {bracket.teamB.user?.ughId?.toUpperCase()} raised dispute
            </div>
          )}
          {canUploadProof && (
            <div style={{ marginTop: 10 }}>
              <DialogButton
                style={{ width: "30rem", position: "fixed" }}
                onAction={proofHandler}
                type="github"
                title="Upload Proof"
                fullButton
              >
                <FileInput
                  name="proof"
                  placeholder="Rank Proof"
                  showImage
                  onChange={onChangeHandler}
                />
              </DialogButton>
            </div>
          )}
          {isProofAvailable && (
            <div className="bracket__rank__proof">
              <div className="bracket__rank__proof__title">uploaded proof</div>
              <a
                href={bracket?.teamA?.uploadUrl}
                className="bracket__rank__proof__container"
                target="_blank"
              >
                <img
                  src={bracket?.teamA?.uploadUrl}
                  alt="UGH PROOF"
                  className="bracket__rank__proof__container__image"
                />
              </a>
              <a
                href={bracket?.teamA?.uploadUrl}
                className="bracket__rank__proof__link"
              >
                Click to view
              </a>
            </div>
          )}
          {canAcceptProof && (
            <div className="bracket__rank__accept">
              <ProgressButton
                type="whatsapp"
                text="Accept"
                size="large"
                onPress={async (_, next) => {
                  await proofAcceptHandler();
                  next();
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BracketRankCard;
