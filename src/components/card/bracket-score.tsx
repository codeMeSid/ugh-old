import React, { useEffect, useState } from "react";
import { BracketDoc } from "../../../server/models/bracket";

import PlayerScoreCard from "./score-player";
const BracketScoreCard = ({ currentUser, bracket, tournamentId, onError }
    : { currentUser: any, bracket: BracketDoc, tournamentId: string, onError: any }) => {

    const isPlayerA = JSON.stringify(bracket.teamA.user?.id) === JSON.stringify(currentUser.id);
    const isPlayerB = JSON.stringify(bracket.teamB.user?.id) === JSON.stringify(currentUser.id);
    const isBracketPlayer = isPlayerA || isPlayerB;
    const A = {
        profilePic: bracket.teamA.user?.uploadUrl,
        ughId: bracket.teamA.user?.ughId,
        hasScore: isBracketPlayer && bracket.teamA.score >= 0,
        score: bracket.teamA.score,
        updateScoreBy: bracket.teamA.uploadBy,
        raiseDisputeBy: bracket.teamA.updateBy,
        proof: bracket.teamA.uploadUrl,
        hasRaisedDispute: bracket.teamA.hasRaisedDispute,
        isWinner: bracket.teamA.user?.ughId === bracket.winner
    };
    const B = {
        profilePic: bracket.teamB.user?.uploadUrl,
        ughId: bracket.teamB.user?.ughId,
        hasScore: isBracketPlayer && bracket.teamB.score >= 0,
        score: bracket.teamB.score,
        updateScoreBy: bracket.teamB.uploadBy,
        raiseDisputeBy: bracket.teamB.updateBy,
        proof: bracket.teamB.uploadUrl,
        hasRaisedDispute: bracket.teamB.hasRaisedDispute,
        isWinner: bracket.teamB.user?.ughId === bracket.winner
    };

    // render
    return <div className="bracket__score">
        <div className="bracket__score__title">round {bracket?.round}</div>
        <div className="bracket__score__container">
            <PlayerScoreCard
                player={{
                    profilePic: A.profilePic,
                    ughId: A.ughId
                }}
                team={{
                    hasScore: isBracketPlayer && A.hasScore,
                    score: A.score,
                    canUploadScore: isPlayerA && !A.hasScore,
                    updateScoreBy: A.updateScoreBy,
                    canUploadProof: isPlayerA && B.hasRaisedDispute && !A.proof,
                    hasRaisedDispute: isBracketPlayer && A.hasRaisedDispute,
                    isWinner: A.isWinner,
                    hasProof: isBracketPlayer && !!A.proof,
                    proof: A.proof
                }}
                bracket={{
                    onError,
                    regId: bracket.regId,
                    tournamentId,
                    wasDisputeRaised: isBracketPlayer && (A.hasRaisedDispute || B.hasRaisedDispute),
                    hasWinner: !!bracket.winner
                }}
                opponent={{
                    raiseDisputeBy: A.raiseDisputeBy,
                    canRaiseDispute: isPlayerB && A.hasScore && !B.hasRaisedDispute && !A.hasRaisedDispute,
                    hasRaisedDispute: isBracketPlayer && B.hasRaisedDispute,
                    canAcceptProof: isPlayerB && B.hasRaisedDispute && !!A.proof
                }}
            />
            <div className="bracket__score__container__vs">
                vs
            </div>
            <PlayerScoreCard
                player={{
                    profilePic: B.profilePic,
                    ughId: B.ughId
                }}
                team={{
                    hasScore: isBracketPlayer && B.hasScore,
                    score: B.score,
                    canUploadScore: isPlayerB && !B.hasScore,
                    updateScoreBy: B.updateScoreBy,
                    canUploadProof: isPlayerB && A.hasRaisedDispute && !B.proof,
                    hasRaisedDispute: isBracketPlayer && B.hasRaisedDispute,
                    isWinner: B.isWinner,
                    hasProof: isBracketPlayer && !!B.proof,
                    proof: B.proof
                }}
                bracket={{
                    onError,
                    regId: bracket.regId,
                    tournamentId,
                    wasDisputeRaised: isBracketPlayer && (A.hasRaisedDispute || B.hasRaisedDispute),
                    hasWinner: !!bracket.winner
                }}
                opponent={{
                    raiseDisputeBy: B.raiseDisputeBy,
                    canRaiseDispute: isPlayerA && B.hasScore && !A.hasRaisedDispute && !B.hasRaisedDispute,
                    hasRaisedDispute: isBracketPlayer && A.hasRaisedDispute,
                    canAcceptProof: isPlayerA && A.hasRaisedDispute && !!B.proof
                }}
            />
        </div>
    </div>
}
export default BracketScoreCard;
