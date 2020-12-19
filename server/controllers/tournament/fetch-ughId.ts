import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";
import mongoose from 'mongoose'

export const tournamentFetchUghIdController = async (req: Request, res: Response) => {
    const { ughId } = req.params
    const user = await User.findOne({ ughId })
    const tournamentsCount = user.tournaments.filter(t => !!!t.name);
    if (tournamentsCount.length !== 0) {
        const tournaments = await Tournament
            .find({ _id: { $in: tournamentsCount.map(t => mongoose.Types.ObjectId(t.id)) } })
            .select("name startDateTime game")
            .populate("game", "name", "Games");
        user.tournaments = user.tournaments.map(t => {
            const tIndex = tournaments.findIndex(p => JSON.stringify(p.id) === JSON.stringify(t.id));
            if (tIndex >= 0) {
                t.name = tournaments[tIndex].name;
                t.startDateTime = tournaments[tIndex].startDateTime;
                t.game = tournaments[tIndex].game?.name;
                t.endDateTime = tournaments[tIndex].endDateTime;
            }
            return t;
        })
    }
    res.send(Array.from(user.toObject().tournaments).reverse());
}