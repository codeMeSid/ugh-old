import { BadRequestError, GameType } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../models/bracket";
import { Tournament } from "../../models/tournament";

export const fetchBracketController = async (req: Request, res: Response) => {
  const { tournamentId } = req.params;
  const { id } = req.currentUser;
  const tournament = await Tournament.findOne({ regId: tournamentId });
  if (!tournament) throw new BadRequestError("Invalid tournament");
  if (
    tournament.players.findIndex(
      (playerId) => JSON.stringify(playerId) === JSON.stringify(id)
    ) === -1
  )
    throw new BadRequestError("Player doesn't belong to tournament");
  const brackets = await Bracket.find({ _id: { $in: tournament.brackets } })
    .populate("teamA.user", "ughId uploadUrl", "Users")
    .populate("teamB.user", "ughId uploadUrl", "Users");
  if (brackets.length === 0)
    throw new BadRequestError("This tournament was hacked.");
  let playerHasUploadedScore = false;
  if (brackets[0].gameType === GameType.Rank)
    for (let i = 0; i < brackets.length; i++)
      if (JSON.stringify(brackets[i].teamA.user.id) === JSON.stringify(id)) {
        playerHasUploadedScore = brackets[i].teamA.score > 0;
        break;
      }

  res.send({ brackets, playerHasUploadedScore });
};
