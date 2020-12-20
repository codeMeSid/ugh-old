import { BadRequestError, NotAuthorizedError, UserRole } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { winnerLogic } from "../../../utils/winner-logic";

export const acceptScoreController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { accept, tournamentId } = req.body;
  const { id, role } = req.currentUser;
  const bracket = await Bracket.findOne({ regId: bracketId })
    .populate("teamA.user", "ughId", "Users")
    .populate("teamB.user", "ughId", "Users");
  if (!bracket) throw new BadRequestError("Invalid Request");
  const isPlayerA =
    JSON.stringify(bracket.teamA.user.id) === JSON.stringify(id);
  const isPlayerB =
    JSON.stringify(bracket.teamB.user.id) === JSON.stringify(id);
  if (!isPlayerA && !isPlayerB && role === UserRole.Player)
    throw new NotAuthorizedError();
  const {
    teamA: { score: scoreA, hasRaisedDispute: disputeA, uploadUrl: uploadA },
    teamB: { score: scoreB, hasRaisedDispute: disputeB, uploadUrl: uploadB },
    winner,
  } = bracket;
  if (winner) throw new BadRequestError("Invalid Request");

  if (disputeA && scoreB >= 0 && uploadB) {
    if (accept) bracket.winner = bracket.teamB.user.ughId;
    else bracket.winner = bracket.teamA.user.ughId;
  } else if (disputeB && scoreA >= 0 && uploadA) {
    if (accept) bracket.winner = bracket.teamA.user.ughId;
    else bracket.winner = bracket.teamB.user.ughId;
  } else throw new BadRequestError("Invalid Request");
  await bracket.save();
  winnerLogic(tournamentId, bracketId, "accept proof score dispute");
  res.send(true);
};
