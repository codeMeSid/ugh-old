import { BadRequestError, UserRole } from "@monsid/ugh";
import { Request, Response } from "express";
import mongoose from "mongoose";
import { Bracket } from "../../models/bracket";
import { winnerLogic } from "../../utils/winner-logic";

export const bracketAcceptProofController = async (
  req: Request,
  res: Response
) => {
  const { bracketId } = req.params;
  const { id, role } = req.currentUser;
  const { accept, tournamentId } = req.body;
  const bracket = await Bracket.findOne({
    regId: bracketId,
    ...(role === UserRole.Admin
      ? {}
      : { "teamB.user": mongoose.Types.ObjectId(id) }),
  }).populate("teamA.user", "ughId", "Users");
  if (!bracket) throw new BadRequestError("Invalid Request");
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
  if (accept && !uploadUrl) throw new BadRequestError("No proof was uploaded");
  if (accept) bracket.winner = ughId;
  else bracket.winner = "NIL-UGH";
  bracket.updateBy = undefined;
  await bracket.save();
  winnerLogic(tournamentId, bracket.id);
  res.send(true);
};
