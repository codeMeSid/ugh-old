import { Bracket } from "../../models/bracket";
import { timerCancelRequest } from "../timer-request-cancel";
import { winnerLogic } from "../winner-logic";

export const bracketScoreUpdateA = async (
  bracketRegId: string,
  tournamentId: string
) => {
  try {
    const bracket = await Bracket.findOne({ regId: bracketRegId })
      .populate("teamA.user", "ughId email", "Users")
      .populate("teamB.user", "ughId email", "Users");
    if (!bracket) throw new Error("Invalid Bracket - add score A");
    if (bracket.winner) return;
    if (bracket.teamA.hasRaisedDispute || bracket.teamB.hasRaisedDispute)
      return;
    if (bracket.teamA.score > bracket.teamB.score)
      bracket.winner = bracket.teamA.user.ughId;
    else bracket.winner = bracket.teamB.user.ughId;
    await bracket.save();
    winnerLogic(tournamentId, bracketRegId, "score teamA added");
    timerCancelRequest(`S-${bracket?.regId}-A`);
    timerCancelRequest(`S-${bracket?.regId}-B`);
  } catch (error) {
    console.log({ msg: "add score A", error: error.messsage });
  }
  return;
};
