import { BadRequestError, NotAuthorizedError, timer } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { TournamentTime } from "../../../utils/enum/tournament-time";
import { winnerLogic } from "../../../utils/winner-logic";

// TODO read back book 15
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
  res.send({ rank });
};
