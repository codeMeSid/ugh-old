import { BadRequestError, timer } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { TournamentTime } from "../../../utils/enum/tournament-time";
import mongoose from "mongoose";
import { Tournament } from "../../../models/tournament";
import { DQ } from "../../../utils/enum/dq";
import { timerRequest } from "../../../utils/timer-request";
import { TimerChannel } from "../../../utils/enum/timer-channel";
import { TimerType } from "../../../utils/enum/timer-type";

export const addRankController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { rank: uploadRank, tournamentId } = req.body;
  const rank = parseInt(uploadRank);
  if (rank === 0) throw new BadRequestError("Invalid Rank");
  const session = await mongoose.startSession();
  session.startTransaction();
  let disputeBracketId: string;
  try {
    const bracket = await Bracket.findOne({ regId: bracketId }).session(
      session
    );
    if (!bracket) throw new BadRequestError("Invalid Request");
    const tournament = await Tournament.findOne({
      regId: tournamentId,
    }).session(session);
    if (!tournament) throw new BadRequestError("Invalid Request");
    const disputeBrackets = await Bracket.find({
      _id: { $in: tournament.brackets },
    }).session(session);
    if (disputeBrackets.length === 0)
      throw new BadRequestError("Invalid Request");
    // find bracket that won dispute of same rank
    const isBracketDisqualified =
      disputeBrackets.findIndex((b) => {
        return (
          b.regId !== bracketId &&
          b.teamA.score === rank &&
          b.teamB.hasRaisedDispute &&
          b.winner &&
          b.winner !== DQ.AdminDQ &&
          b.winner !== DQ.DisputeLost
        );
      }) > -1;

    const isSelfDisputeIndex = disputeBrackets.findIndex((b) => {
      return (
        b.regId !== bracketId &&
        b.teamA.score === rank &&
        !b.teamB.hasRaisedDispute &&
        b.winner &&
        b.winner !== DQ.AdminDQ &&
        b.winner !== DQ.DisputeLost
      );
    });

    if (isBracketDisqualified) bracket.winner = DQ.DisputeLost;
    else if (isSelfDisputeIndex > -1) {
      bracket.teamB.user = disputeBrackets[isSelfDisputeIndex].teamA.user;
      bracket.teamB.hasRaisedDispute = true;
    } else {
      disputeBracketId =
        disputeBrackets[
          disputeBrackets.findIndex((b) => {
            return (
              b.regId !== bracketId &&
              b.teamA.score === rank &&
              !b.teamB.hasRaisedDispute &&
              !b.winner
            );
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
    if (!bracket.winner)
      timerRequest(bracketId, bracket.updateBy, {
        channel: TimerChannel.Bracket,
        type: TimerType.Rank,
        eventName: { bracketId: bracket.id, tournamentId },
      });
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(disputeBracketId);
};
