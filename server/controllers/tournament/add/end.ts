import { timer, TournamentStatus } from "@monsid/ugh-og"
import { Tournament } from "../../../models/tournament";
import { winnerLogic } from "../../../utils/winner-logic";

export const tournamentEndTimer = (regId: string, id: string, endDateTime: Date) => timer.schedule(
    `${regId}-end`,
    new Date(endDateTime),
    async ({ id }: { id: string }) => {
        try {
            const tournament = await Tournament.findById(id);
            if (!tournament) return;
            if (tournament.status === TournamentStatus.Started) {
                tournament.status = TournamentStatus.Completed;
                await tournament.save();
                winnerLogic(tournament.regId, null, "end");
            }
        } catch (error) {
            console.log({ m: "end", error: error.message });
        }
    },
    { id }
);