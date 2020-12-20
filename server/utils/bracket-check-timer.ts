import { timer } from "@monsid/ugh-og"
import mongoose from "mongoose";
import { Bracket } from "../models/bracket";
import { DQ } from "./enum/dq";
import { winnerLogic } from "./winner-logic";


export const bracketCheckTimer = (regId: string, startDateTime: Date, tournamentRegId: string) => timer.schedule(
    `${regId}-check`,
    startDateTime,
    async ({ regId, tournamentRegId }) => {

        try {
            const bracket = await Bracket.findOne({ regId })
                .populate("teamA.user", "ughId", "Users")
                .populate("teamB.user", "ughId", "Users");

            if (!bracket) return;
            const {
                teamA: { score: sA, user: { ughId: uA }, hasRaisedDispute: dA, uploadUrl: pA },
                teamB: { score: sB, user: { ughId: uB }, hasRaisedDispute: dB, uploadUrl: pB },
                winner,
            } = bracket;

            if (winner) return;
            // checks
            // if teamA & teamB didnot update score
            // if teamA added score & teamB did not 
            // if teamB added score & teamA did not
            // if teamA has raised dispute & no proof by teamB
            // if teamB has raised dispute & no proof by teamA
            // if teamA score > teamB given no dispute was raised
            // if teamA score < teamB given no dispute was raised
            if (sA === -1 && sB === -1) bracket.winner = DQ.ScoreNotUploaded;
            else if (sA === -1 && sB !== -1) bracket.winner = uB;
            else if (sA !== -1 && sB === -1) bracket.winner = uA;
            else if (dA && !pB) bracket.winner = uA;
            else if (dB && !pA) bracket.winner = uB;
            else if ((!dA && !dB) && sA > sB) bracket.winner = uA;
            else if ((!dA && !dB) && sB > sA) bracket.winner = uB;

            await bracket.save();
            winnerLogic(tournamentRegId, regId, "score check timer");
        } catch (error) {
            return;
        }
    },
    { regId, tournamentRegId }
);