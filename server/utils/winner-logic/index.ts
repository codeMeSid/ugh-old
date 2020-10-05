import { errorlog, GameType } from "@monsid/ugh";
import mongoose from "mongoose";
import { Bracket } from "../../models/bracket";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";
import { rankLogger } from "./rank";
import { scoreLogger } from "./score";

export const winnerLogic = async (
  tournamentId: string,
  bracketId?: string,
  isTournamentEnd?: boolean,
  message?: string
) => {
  console.log({ message });
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tournament = await Tournament.findOne({
      regId: tournamentId,
    })
      .populate("game", "gameType", "Games")
      .session(session);
    if (!tournament) {
      errorlog("tournament failed");
      return;
    }
    const users = await User.find({ _id: { $in: tournament.players } }).session(
      session
    );
    const brackets = await Bracket.find({
      _id: { $in: tournament.brackets },
    }).session(session);
    let updates;
    switch (tournament.game.gameType) {
      case GameType.Rank:
        updates = await rankLogger(tournament, brackets, users);
        break;
      case GameType.Score:
        updates = await scoreLogger(tournament, brackets, users);
        break;
    }

    await session.commitTransaction();
  } catch (error) {
    console.log({ error: error.message });
    await session.abortTransaction();
  }
  session.endSession();
};
