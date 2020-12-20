import { BadRequestError } from "@monsid/ugh-og"
import { Request, Response } from "express";
import { Passbook, PassbookDoc } from "../../models/passbook";
import { User } from "../../models/user";
import { TransactionEnv } from "../../utils/enum/transaction-env";
import { TransactionType } from "../../utils/enum/transaction-type";
import mongoose from 'mongoose';

export const userUpdateTournamentController = async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction()
    try {
        const { winning, id, ughId } = req.body;
        const user = await User.findOne({ ughId }).session(session);
        if (!user) throw new BadRequestError("Invalid User");
        let passbook: PassbookDoc;
        user.tournaments = user.tournaments.map(t => {
            if (JSON.stringify(t.id) === JSON.stringify(id)) {
                t.didWin = true;
                t.coins = parseInt(winning);
                passbook = Passbook.build({
                    coins: winning,
                    transactionEnv: TransactionEnv.TournamentWin,
                    transactionType: TransactionType.Credit,
                    ughId,
                    event: t.name
                })
            }
            return t;
        });
        user.wallet.coins += parseInt(winning);
        await user.save({ session });
        if (passbook) await passbook.save({ session })
        await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();
    }
    session.endSession();
    res.send(true)
}