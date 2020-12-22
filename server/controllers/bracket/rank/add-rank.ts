import { BadRequestError, NotAuthorizedError, timer } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { TournamentTime } from "../../../utils/enum/tournament-time";
import { winnerLogic } from "../../../utils/winner-logic";
import mongoose from 'mongoose';
import { Tournament } from "../../../models/tournament";
import { DQ } from "../../../utils/enum/dq";

// TODO read back book 15
export const addRankController = async (req: Request, res: Response) => {
  // const { id } = req.currentUser;
  const { bracketId } = req.params;
  const { rank: uploadRank, tournamentId } = req.body;
  const rank = parseInt(uploadRank);
  if (rank === 0) throw new BadRequestError("Invalid Rank");
  const session = await mongoose.startSession();
  session.startTransaction();
  let disputeBracketId: string;
  try {
    const bracket = await Bracket.findOne({ regId: bracketId }).session(session);
    if (!bracket) throw new BadRequestError("Invalid Request");
    const tournament = await Tournament.findOne({ regId: tournamentId }).session(session);
    if (!tournament) throw new BadRequestError("Invalid Request")
    const disputeBrackets = await Bracket.find({ _id: { $in: tournament.brackets } }).session(session);
    if (disputeBrackets.length === 0) throw new BadRequestError("Invalid Request");
    const isBracketDisqualified = disputeBrackets
      .findIndex(b => {
        return b.regId !== bracketId &&
          b.teamA.score === rank
          && b.teamB.hasRaisedDispute
          && b.winner
          && b.winner !== DQ.AdminDQ
          && b.winner !== DQ.DisputeLost
      }) > -1;

    if (isBracketDisqualified) bracket.winner = DQ.DisputeLost;
    else {
      disputeBracketId = disputeBrackets[
        disputeBrackets.findIndex(b => {
          return b.regId !== bracketId &&
            b.teamA.score === rank
            && !b.teamB.hasRaisedDispute
            && !b.winner
        })
      ]?.regId;
    }
    bracket.teamA.score = rank;
    bracket.updateBy = new Date(
      Date.now() + TournamentTime.TournamentRankDisputeTime
    );
    bracket.uploadBy = undefined;
    await bracket.save({ session });
    await session.commitTransaction();
    if (!bracket.winner) {
      timer.schedule(
        bracketId,
        bracket.updateBy,
        async ({ id, tournamentId }, done) => {
          try {
            const bracket = await Bracket.findById(id).populate(
              "teamA.user",
              "ughId",
              "Users"
            );
            if (!bracket) throw new Error("Invalid bracket - add rank");
            if (bracket.teamB.hasRaisedDispute) throw new Error("bracket has dispute - add rank");
            if (bracket.winner) throw new Error("bracket has completed - add rank");
            bracket.winner = bracket.teamA.user.ughId;
            bracket.updateBy = undefined;
            bracket.uploadBy = undefined;
            await bracket.save();
            done();
            winnerLogic(tournamentId, null, "rank added");
          } catch (error) {
            console.log(error.message);
            done();
          }
        },
        { id: bracket.id, tournamentId }
      );
    }
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message)
  }
  session.endSession();
  res.send(disputeBracketId);
};
