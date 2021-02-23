import { TournamentStatus } from "@monsid/ugh-og";
import { Tournament } from "../../models/tournament";
import { timerCancelRequest } from "../timer-request-cancel";
import { winnerLogic } from "../winner-logic";

export const tournamentEnd = async (id: string) => {
  console.log("Tournament-End");
  try {
    const tournament = await Tournament.findById(id).populate(
      "brackets",
      "regId",
      "Brackets"
    );
    if (!tournament) throw new Error("Invalid Tournament");
    if (tournament.status === TournamentStatus.Started) {
      tournament.set({ status: TournamentStatus.Completed });
      await tournament.save();
      winnerLogic(tournament.regId, null, "end");
      tournament.brackets.forEach((bracket) => {
        const bracketId = bracket.regId;
        timerCancelRequest(bracketId);
        timerCancelRequest(`S-${bracketId}-A`);
        timerCancelRequest(`S-${bracketId}-B`);
      });
    } else throw new Error("Cannot end");
  } catch (error) {
    console.log({ msg: "Tournament End", error: error.messsage });
  }
  return;
};
