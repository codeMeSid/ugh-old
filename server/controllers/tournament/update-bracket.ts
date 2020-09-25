import { BadRequestError, timer } from "@monsid/ugh";
import { Request, Response } from "express";
import { Bracket } from "../../models/bracket";
import { Tournament } from "../../models/tournament";
import { winnerLogic } from "../../utils/winner-logic";

export const bracketUpdateController = async (req: Request, res: Response) => {
  const { bracketId } = req.params;
  const { teamA: teamAScore, teamB: teamBScore } = req.body;
  if (!teamAScore && !teamBScore)
    throw new BadRequestError("Score upload failed");
  const bracket = await Bracket.findOne({ regId: bracketId });
  if (!bracket) throw new BadRequestError("something went wrong");
  if (bracket.winner) throw new BadRequestError("This match is over");
  const tournament = await Tournament.findOne({
    brackets: { $in: [bracket.id] },
  }).populate("brackets", "round teamA teamB", "Brackets");
  if (!tournament) throw new BadRequestError("something went wrong");
  const { regId } = bracket;
  const scoreUpdateTime = new Date(Date.now() + 1000 * 60 * 20);
  if (teamAScore) bracket.teamA.score = teamAScore;
  if (teamBScore) bracket.teamB.score = teamBScore;
  bracket.updateBy = scoreUpdateTime;
  await bracket.save();
  if (teamAScore) timer.cancel(`${regId}-B`);
  if (teamBScore) timer.cancel(`${regId}-A`);
  if (teamAScore)
    timer.schedule(
      `${regId}-A`,
      scoreUpdateTime,
      async ({ regId, tId }) => {
        const bracket = await Bracket.findOne({ regId }).populate(
          "teamA.user",
          "ughId",
          "Users"
        );
        if (!bracket) return;
        if (bracket.teamB.score) {
          winnerLogic(tId, bracket.id);
          return;
        }
        if (bracket.teamB.hasRaisedDispute) return;
        bracket.winner = bracket.teamA.user.ughId;
        bracket.updateBy = undefined;
        await bracket.save();
        winnerLogic(tId, bracket.id);
      },
      {
        regId,
        tId: tournament.id,
      }
    );

  if (teamBScore)
    timer.schedule(
      `${regId}-B`,
      scoreUpdateTime,
      async ({ regId, tId }) => {
        const bracket = await Bracket.findOne({ regId }).populate(
          "teamB.user",
          "ughId",
          "Users"
        );
        if (!bracket) return;
        if (bracket.teamA.score) {
          winnerLogic(tId, bracket.id);
          return;
        }
        if (bracket.teamA.hasRaisedDispute) return;
        bracket.winner = bracket.teamB.user.ughId;
        bracket.updateBy = undefined;
        await bracket.save();
        winnerLogic(tId, bracket.id);
      },
      {
        regId,
        tId: tournament.id,
      }
    );

  res.send(true);
};
