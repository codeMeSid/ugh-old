import { BadRequestError, GameType } from "@monsid/ugh";
import mongoose from "mongoose";
import { Bracket } from "../models/bracket";
import { Tournament } from "../models/tournament";
import { User } from "../models/user";
import { prizeDistribution } from "./prize-distribution";

export const winnerLogic = async (
  tournamentId: string,
  bracketId?: string,
  isTournamentEnd?: boolean
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tournament = await Tournament.findOne({
      regId: tournamentId,
    })
      .populate("game", "gameType", "Games")
      .session(session);
    if (!tournament) return;
    const winnerPrize = prizeDistribution(
      tournament.winnerCoin,
      tournament.winnerCount
    );
    let brackets = await Bracket.find({
      _id: { $in: tournament.brackets },
    }).session(session);
    if (brackets.length === 0) return;
    switch (tournament.game.gameType) {
      case GameType.Rank:
        const isTournamentOver =
          new Date(tournament.endDateTime).valueOf() < Date.now();
        if (isTournamentEnd || isTournamentOver)
          brackets = brackets.map((bracket) => {
            if (bracket.teamA.score === 0) bracket.winner = "NIL-UGH";
            return bracket;
          });

        const bracketsWithWinner = brackets.filter(({ winner }) => winner);
        if (bracketsWithWinner.length !== brackets.length) {
          console.log("Winner not evaluated");
          return;
        }
        const winnerList = brackets
          .filter(({ winner }) => winner !== "NUL-UGH")
          .sort((bA, bB) => bA.teamA.score - bB.teamA.score)
          .slice(0, tournament.winnerCount);
        const users = await User.find({
          _id: { $in: winnerList.map((winner) => winner.teamA.user) },
        });
        tournament.winners = users.map((user) => user.ughId);
        users.map(async (user, index) => {
          user.wallet.coins += winnerPrize[index];
          await user.save({ session });
        });
        break;
      case GameType.Score:
        break;
    }
    brackets.map(async (bracket) => {
      await bracket.save({ session });
    });
    await tournament.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log({ message: error.message });
    await session.abortTransaction();
  }
  session.endSession();
};
