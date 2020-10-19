import { BadRequestError, NotAuthorizedError, timer } from "@monsid/ugh";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bracket } from "../../../models/bracket";
import { winnerLogic } from "../../../utils/winner-logic";

export const addScoreController = async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const { bracketId } = req.params;
  const { score, tournamentId } = req.body;
  const bracket = await Bracket.findOne({ regId: bracketId });
  if (!bracket) throw new BadRequestError("Invalid match");
  if (bracket.winner) throw new BadRequestError("Match is over");
  const isPlayerA = JSON.stringify(bracket.teamA.user) === JSON.stringify(id);
  const isPlayerB = JSON.stringify(bracket.teamB.user) === JSON.stringify(id);
  if (!isPlayerA && !isPlayerB) throw new NotAuthorizedError();
  if (isPlayerA) {
    if (bracket.teamA.score >= 0)
      throw new BadRequestError("Score already updated");
    bracket.teamA.score = score;
    bracket.teamA.uploadBy = undefined;
    bracket.teamA.updateBy = new Date(Date.now() + 1000 * 60 * 20);
    const hasTeamBUpdatedScore =
      bracket.teamB.score >= 0 && bracket.teamB.updateBy;
    if (hasTeamBUpdatedScore) {
      const canUpdateScore =
        Date.now() < new Date(bracket.teamB.updateBy).valueOf();
      if (canUpdateScore) timer.cancel(`${bracketId}-B`);
      else throw new BadRequestError("Time up to update score");
    }
  }
  if (isPlayerB) {
    if (bracket.teamB.score >= 0)
      throw new BadRequestError("Score already updated");
    bracket.teamB.score = score;
    bracket.teamB.uploadBy = undefined;
    bracket.teamB.updateBy = new Date(Date.now() + 1000 * 60 * 20);
    const hasTeamAUpdatedScore =
      bracket.teamA.score >= 0 && bracket.teamA.updateBy;
    if (hasTeamAUpdatedScore) {
      const canUpdateScore =
        Date.now() < new Date(bracket.teamA.updateBy).valueOf();
      if (canUpdateScore) timer.cancel(`${bracketId}-B`);
      else throw new BadRequestError("Time up to update score");
    }
  }
  await bracket.save();
  if (isPlayerA) {
    timer.schedule(
      `${bracketId}-A`,
      bracket.teamA.updateBy,
      async ({ regId, tournamentId }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const bracket = await Bracket.findOne({ regId })
            .populate("teamA.user", "ughId email", "Users")
            .populate("teamB.user", "ughId email", "Users")
            .session(session);
          if (!bracket) throw new Error("Invalid Bracket");
          if (bracket.winner) throw new Error("winner exists");
          if (bracket.teamA.hasRaisedDispute || bracket.teamB.hasRaisedDispute)
            throw new Error("dispute was raised");
          if (bracket.teamA.score > bracket.teamB.score)
            bracket.winner = bracket.teamA.user.ughId;
          else bracket.winner = bracket.teamB.user.ughId;
          await bracket.save({ session });
          await session.commitTransaction();
        } catch (error) {
          console.log({ error: error.message });
          await session.abortTransaction();
        }
        session.endSession();
        winnerLogic(tournamentId, regId, false, "score teamA added");
      },
      { regId: bracketId, tournamentId }
    );
  }
  if (isPlayerB) {
    timer.schedule(
      `${bracketId}-B`,
      bracket.teamB.updateBy,
      async ({ regId, tournamentId }) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
          const bracket = await Bracket.findOne({ regId })
            .populate("teamA.user", "ughId email", "Users")
            .populate("teamB.user", "ughId email", "Users")
            .session(session);
          if (!bracket) throw new Error("Invalid Bracket");
          if (bracket.winner) throw new Error("winner exists");
          if (bracket.teamA.hasRaisedDispute || bracket.teamB.hasRaisedDispute)
            throw new Error("dispute was raised");
          if (bracket.teamA.score > bracket.teamB.score)
            bracket.winner = bracket.teamA.user.ughId;
          else bracket.winner = bracket.teamB.user.ughId;
          await bracket.save({ session });
          await session.commitTransaction();
        } catch (error) {
          console.log({ error: error.message });
          await session.abortTransaction();
        }
        session.endSession();
        winnerLogic(tournamentId, regId, false, "score teamB added");
      },
      { regId: bracketId, tournamentId }
    );
  }
  res.send(true);
};
