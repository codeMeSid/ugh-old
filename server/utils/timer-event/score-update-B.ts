import { Bracket } from "../../models/bracket";
import { winnerLogic } from "../winner-logic";

export const bracketScoreUpdateB = async (
  bracketRegId: string,
  tournamentId: string
) => {
  try {
    const bracket = await Bracket.findOne({ regId: bracketRegId })
      .populate("teamA.user", "ughId email", "Users")
      .populate("teamB.user", "ughId email", "Users");
    if (!bracket) throw new Error("Invalid Bracket - add score B");
    if (bracket.winner) return;
    if (bracket.teamA.hasRaisedDispute || bracket.teamB.hasRaisedDispute)
      return;
    if (bracket.teamA.score > bracket.teamB.score)
      bracket.winner = bracket.teamA.user?.ughId;
    else bracket.winner = bracket.teamB.user?.ughId;
    await bracket.save();
    winnerLogic(tournamentId, bracketRegId, "score teamB added");
  } catch (error) {
    console.log({ msg: "add score B", error });
  }
  return;
};
