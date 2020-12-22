import { timer, TournamentStatus } from "@monsid/ugh-og"
import { Tournament } from "../../../models/tournament";
import { winnerLogic } from "../../../utils/winner-logic";

export const tournamentEndTimer = (regId: string, id: string, endDateTime: Date) => timer.schedule(
    `${regId}-end`,
    new Date(endDateTime),
    async ({ id }: { id: string }, done) => {
        try {
            const tournament = await Tournament.findById(id);
            if (!tournament) throw new Error("Invalid Tournament - manual start")
            if (tournament.status === TournamentStatus.Started) {
                tournament.set({ status: TournamentStatus.Completed });
                await tournament.save();
                done();
                winnerLogic(tournament.regId, null, "end");
            } else throw new Error("Tournament Status - auto start");

        } catch (error) {
            console.log(error.message);
            done();
        }
    },
    { id }
);