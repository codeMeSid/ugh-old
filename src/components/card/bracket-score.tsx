import React, { useEffect, useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";
import { DQ } from "../../../server/utils/enum/dq";
import { TournamentTime } from "../../../server/utils/enum/tournament-time";
import Timer from "../timer";

import PlayerScoreCard from "./score-player";
const BracketScoreCard = ({
  currentUser,
  bracket,
  tournamentId,
  onError,
}: {
  currentUser: any;
  bracket: BracketDoc;
  tournamentId: string;
  onError: any;
}) => {
  const isPlayerA =
    JSON.stringify(bracket.teamA.user?.id) === JSON.stringify(currentUser.id);
  const isPlayerB =
    JSON.stringify(bracket.teamB.user?.id) === JSON.stringify(currentUser.id);
  const isBracketPlayer = isPlayerA || isPlayerB;
  const A = {
    profilePic: bracket.teamA.user?.uploadUrl,
    ughId: bracket.teamA.user?.ughId,
    hasScore: bracket.teamA.score >= 0,
    score: bracket.teamA.score,
    updateScoreBy: bracket.teamA.uploadBy,
    raiseDisputeBy: bracket.teamA.updateBy,
    proof: bracket.teamA.uploadUrl,
    hasRaisedDispute: bracket.teamA.hasRaisedDispute,
    isWinner:
      bracket.teamA.user?.ughId === bracket.winner &&
      bracket.winner !== DQ.ScoreNotUploaded,
  };
  const B = {
    profilePic: bracket.teamB.user?.uploadUrl,
    ughId: bracket.teamB.user?.ughId,
    hasScore: bracket.teamB.score >= 0,
    score: bracket.teamB.score,
    updateScoreBy: bracket.teamB.uploadBy,
    raiseDisputeBy: bracket.teamB.updateBy,
    proof: bracket.teamB.uploadUrl,
    hasRaisedDispute: bracket.teamB.hasRaisedDispute,
    isWinner:
      bracket.teamB.user?.ughId === bracket.winner &&
      bracket.winner !== DQ.ScoreNotUploaded,
  };

  // render
  return (
    <div className="bracket__score">
      <div className="bracket__score__title">round {bracket?.round}</div>
      {B?.ughId && !bracket.winner && (
        <div className="bracket__score__check-timer">
          Round ends in{" "}
          <Timer
            dateTime={
              new Date(
                new Date(A.updateScoreBy).getTime() +
                  TournamentTime.TournamentScoreCheckTime
              )
            }
            format={"M S"}
            canCountdown
          />
        </div>
      )}
      <div className="bracket__score__container">
        <PlayerScoreCard
          tournamentId={tournamentId}
          player={{
            profilePic: A.profilePic,
            ughId: A.ughId,
            isCurrentUser: currentUser.ughId === A.ughId,
          }}
          team={{
            hasScore: A.hasScore,
            score: A.score,
            canUploadScore: isPlayerA && !A.hasScore,
            updateScoreBy: A.updateScoreBy,
            canUploadProof: isPlayerA && B.hasRaisedDispute && !A.proof,
            hasRaisedDispute: isBracketPlayer && A.hasRaisedDispute,
            isWinner: A.isWinner,
            hasProof: isBracketPlayer && !!A.proof,
            proof: A.proof,
          }}
          bracket={{
            onError,
            regId: bracket.regId,
            tournamentId,
            wasDisputeRaised:
              isBracketPlayer && (A.hasRaisedDispute || B.hasRaisedDispute),
            hasWinner: !!bracket.winner,
          }}
          opponent={{
            ughId: B.ughId,
            raiseDisputeBy: A.raiseDisputeBy,
            canRaiseDispute:
              isPlayerB &&
              A.hasScore &&
              B.hasScore &&
              !B.hasRaisedDispute &&
              !A.hasRaisedDispute,
            hasRaisedDispute: isBracketPlayer && B.hasRaisedDispute,
            canAcceptProof: isPlayerB && B.hasRaisedDispute && !!A.proof,
            hasScore: B.hasScore,
            score: B.score,
          }}
        />
        <div className="bracket__score__container__vs">vs</div>
        <PlayerScoreCard
          tournamentId={tournamentId}
          player={{
            profilePic: B.profilePic,
            ughId: B.ughId,
            isCurrentUser: currentUser.ughId === B.ughId,
          }}
          team={{
            hasScore: B.hasScore,
            score: B.score,
            canUploadScore: isPlayerB && !B.hasScore,
            updateScoreBy: B.updateScoreBy,
            canUploadProof: isPlayerB && A.hasRaisedDispute && !B.proof,
            hasRaisedDispute: isBracketPlayer && B.hasRaisedDispute,
            isWinner: B.isWinner,
            hasProof: isBracketPlayer && !!B.proof,
            proof: B.proof,
          }}
          bracket={{
            onError,
            regId: bracket.regId,
            tournamentId,
            wasDisputeRaised:
              isBracketPlayer && (A.hasRaisedDispute || B.hasRaisedDispute),
            hasWinner: !!bracket.winner,
          }}
          opponent={{
            ughId: A.ughId,
            raiseDisputeBy: B.raiseDisputeBy,
            canRaiseDispute:
              isPlayerA &&
              A.hasScore &&
              B.hasScore &&
              !A.hasRaisedDispute &&
              !B.hasRaisedDispute,
            hasRaisedDispute: isBracketPlayer && A.hasRaisedDispute,
            canAcceptProof: isPlayerA && A.hasRaisedDispute && !!B.proof,
            hasScore: A.hasScore,
            score: A.score,
          }}
        />
      </div>
    </div>
  );
};
export default BracketScoreCard;
