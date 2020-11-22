import { BadRequestError, UserRole } from "@monsid/ugh";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bracket } from "../../../models/bracket";
import { winnerLogic } from "../../../utils/winner-logic";
import { DQ } from "../../../utils/enum/dq";
import { Tournament } from "../../../models/tournament";

// if dispute is accepted in favour of teamA
// then DQ the teamB from their rank bracket
export const acceptProofController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { id, role } = req.currentUser;
  const { accept, tournamentId } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const bracket = await Bracket.findOne({
      regId: bracketId,
      ...(role === UserRole.Admin
        ? {}
        : { "teamB.user": mongoose.Types.ObjectId(id) }),
    })
      .populate("teamA.user", "ughId", "Users")
      .session(session);

    const tournament = await Tournament.findOne({
      regId: tournamentId,
    }).session(session);
    if (!bracket) throw new BadRequestError("Invalid Request");
    const bracketB = await Bracket.findOne({
      _id: { $in: tournament.brackets },
      "teamA.user": bracket.teamB.user,
    })
      .populate("teamA.user", "ughId", "Users")
      .session(session);
    const {
      teamA: {
        score,
        uploadUrl,
        user: { ughId },
      },
      teamB: { hasRaisedDispute },
      winner,
    } = bracket;
    if (score === 0) throw new BadRequestError("Score not uploaded");
    if (winner) throw new BadRequestError("Bracket is complete");
    if (!hasRaisedDispute) throw new BadRequestError("No issue was raised");
    if (accept && !uploadUrl)
      throw new BadRequestError("No proof was uploaded");
    if (accept) {
      bracket.winner = ughId;
      if (bracketB) bracketB.winner = DQ.DisputeLost;
    } else {
      bracket.winner = DQ.DisputeLost;
      if (
        bracketB &&
        bracketB.winner !== DQ.DisputeLost &&
        bracketB.winner !== DQ.ScoreNotUploaded
      ) {
        bracketB.winner = bracketB.teamA.user?.ughId;
      }
    }
    bracket.updateBy = undefined;
    bracket.uploadBy = undefined;
    await bracket.save({ session });
    if (bracketB) await bracketB.save({ session });
    await session.commitTransaction();
  } catch (error) {
    console.log({ msg: "rank accept proof", error: error.message });
    await session.abortTransaction();
  }
  session.endSession();
  winnerLogic(tournamentId, bracketId, "dispute accepted");
  res.send(true);
};
