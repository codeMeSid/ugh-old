import { BadRequestError, NotAuthorizedError, timer } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { TournamentTime } from "../../../utils/enum/tournament-time";
import { winnerLogic } from "../../../utils/winner-logic";

export const addRankController = async (req: Request, res: Response) => {
  const { id } = req.currentUser;
  const { bracketId } = req.params;
  const { rank, tournamentId } = req.body;
  if (rank === 0) throw new BadRequestError("Cannot update 0 rank");
  const bracket = await Bracket.findOne({ regId: bracketId });
  if (!bracket) throw new BadRequestError("Invalid match");
  if (JSON.stringify(id) !== JSON.stringify(bracket.teamA.user))
    throw new NotAuthorizedError();
  if (bracket.teamA.score > 0)
    throw new BadRequestError("Rank once updated cannot change now");
  bracket.teamA.score = rank;
  bracket.updateBy = new Date(
    Date.now() + TournamentTime.TournamentRankDisputeTime
  );
  bracket.uploadBy = undefined;
  await bracket.save();
  timer.schedule(
    bracketId,
    bracket.updateBy,
    async ({ id, tournamentId }) => {
      const bracket = await Bracket.findById(id).populate(
        "teamA.user",
        "ughId",
        "Users"
      );
      if (!bracket) return;
      if (bracket.teamB.hasRaisedDispute) return;
      if (bracket.winner) return;
      bracket.winner = bracket.teamA.user.ughId;
      bracket.updateBy = undefined;
      bracket.uploadBy = undefined;
      await bracket.save();
      winnerLogic(tournamentId, null, "rank added");
    },
    { id: bracket.id, tournamentId }
  );
  res.send(true);
};
