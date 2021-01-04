import { BadRequestError, TournamentStatus } from "@monsid/ugh-og"
import { Request, Response } from "express";
import mongoose from 'mongoose';
import { Passbook } from "../../models/passbook";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";

export const tournamentLeaveHandler = async (req: Request, res: Response) => {
    const { tournamentId } = req.params;
    const { id } = req.currentUser;
    const session = await mongoose.startSession()
    session.startTransaction();
    try {
        const tournament = await Tournament.findById(tournamentId).session(session);
        if (!tournament) throw new BadRequestError("Invalid Tournament");
        if (tournament.status !== TournamentStatus.Upcoming) throw new BadRequestError("Cannot leave tournament at this stage");
        if (new Date(tournament.startDateTime).valueOf() - Date.now() < 1000 * 60 * 30) throw new BadRequestError("Deadline to back out it over. Cannot escape now.");

        const user = await User.findById(id).session(session);
        if (!user) throw new BadRequestError("Invalid User");

        tournament.players = tournament.players.filter(pId => JSON.stringify(pId) !== JSON.stringify(user.id));
        user.tournaments = user.tournaments.filter(t => JSON.stringify(t.id) !== JSON.stringify(tournament.id));
        const penaltyCoins = Math.floor(tournament.coins / 2);
        user.wallet.coins += tournament.isFree ? 0 : tournament.coins - penaltyCoins;

        const passbook = Passbook.build({
            coins: penaltyCoins,
            transactionEnv: TransactionEnv.TournamentLeave,
            transactionType: TransactionType.Credit,
            ughId: user.ughId,
            event: tournament.name
        })

        await user.save({ session });
        await tournament.save({ session });
        await passbook.save({ session });
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
    }
    session.endSession();
    res.json(true)
}