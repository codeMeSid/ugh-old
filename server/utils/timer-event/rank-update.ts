import { Bracket } from "../../models/bracket";
import { winnerLogic } from "../winner-logic";

export const bracketRankUpdate = async (
  bracketId: string,
  tournamentId: string
) => {
  try {
    const bracket = await Bracket.findById(bracketId).populate(
      "teamA.user",
      "ughId",
      "Users"
    );
    if (!bracket) throw new Error("Invalid bracket - add rank");
    if (bracket.teamB.hasRaisedDispute) return;
    if (bracket.winner) return;
    bracket.winner = bracket.teamA.user.ughId;
    bracket.updateBy = undefined;
    bracket.uploadBy = undefined;
    await bracket.save();
    // winnerLogic(tournamentId, null, "rank added");
  } catch (error) {
    console.log({ msg: "add rank", error: error.message });
  }
};
