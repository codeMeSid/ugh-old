import { BadRequestError, NotAuthorizedError, timer } from "@monsid/ugh-og";
import { Request, Response } from "express";
import { Bracket } from "../../../models/bracket";
import { TimerChannel } from "../../../utils/enum/timer-channel";
import { TimerType } from "../../../utils/enum/timer-type";
import { TournamentTime } from "../../../utils/enum/tournament-time";
import { timerRequest } from "../../../utils/timer-request";
import { timerCancelRequest } from "../../../utils/timer-request-cancel";

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
    bracket.teamA.updateBy = new Date(
      Date.now() + TournamentTime.TournamentScoreDisputeTime
    );
    const hasTeamBUpdatedScore =
      bracket.teamB.score >= 0 && bracket.teamB.updateBy;
    if (hasTeamBUpdatedScore) {
      const canUpdateScore =
        Date.now() < new Date(bracket.teamB.updateBy).valueOf();
      if (canUpdateScore) timerCancelRequest(`S-${bracket.regId}-B`);
      else throw new BadRequestError("Time up to update score");
    }
  }
  if (isPlayerB) {
    if (bracket.teamB.score >= 0)
      throw new BadRequestError("Score already updated");
    bracket.teamB.score = score;
    bracket.teamB.updateBy = new Date(
      Date.now() + TournamentTime.TournamentScoreDisputeTime
    );
    const hasTeamAUpdatedScore =
      bracket.teamA.score >= 0 && bracket.teamA.updateBy;
    if (hasTeamAUpdatedScore) {
      const canUpdateScore =
        Date.now() < new Date(bracket.teamA.updateBy).valueOf();
      if (canUpdateScore) timerCancelRequest(`S-${bracket.regId}-A`);
      else throw new BadRequestError("Time up to update score");
    }
  }
  await bracket.save();
  if (isPlayerA) {
    timerRequest(`S-${bracket.regId}-A`, bracket.teamA.updateBy, {
      channel: TimerChannel.Bracket,
      type: TimerType.ScoreA,
      eventName: {
        bracketRegId: bracket.regId,
        tournamentId,
      },
    });
  } else if (isPlayerB) {
    timerRequest(`S-${bracket.regId}-B`, bracket.teamB.updateBy, {
      channel: TimerChannel.Bracket,
      type: TimerType.ScoreB,
      eventName: {
        bracketRegId: bracket.regId,
        tournamentId,
      },
    });
  }
  res.send(true);
};
