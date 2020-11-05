import { errorlog, GameType, timer, TournamentStatus } from "@monsid/ugh";
import mongoose from "mongoose";
import { Bracket, BracketDoc } from "../../models/bracket";
import { Tournament, TournamentDoc } from "../../models/tournament";
import { User, UserDoc } from "../../models/user";
import { rankLogger } from "./rank";
import { scoreLogger } from "./score";

export const winnerLogic = async (
  tournamentId: string,
  bracketId?: string,
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
    if (tournament.winners.length >= 1) return;
    const users = await User.find({ _id: { $in: tournament.players } }).session(
      session
    );
    const brackets = await Bracket.find({
      _id: { $in: tournament.brackets },
    }).session(session);
    const bracket = await Bracket.findOne({ regId: bracketId }).session(
      session
    );
    if (brackets.length === 0) return;
    let updates: {
      updatedTournament: TournamentDoc;
      updatedBrackets: Array<BracketDoc>;
      updateUsers: Array<UserDoc>;
    };
    switch (tournament.game.gameType) {
      case GameType.Rank:
        updates = await rankLogger(tournament, brackets, users);
        break;
      case GameType.Score:
        updates = await scoreLogger(tournament, brackets, bracket, users);
        break;
    }

    if (updates) {
      await Promise.all([
        updates.updateUsers.map(async (u) => await u.save({ session })),
        updates.updatedBrackets.map(async (b) => await b.save({ session })),
      ]);
      await updates.updatedTournament.save({ session });
    }
    if (updates.updatedTournament.status === TournamentStatus.Completed)
      timer.cancel(`${tournament.regId}-end`);
    await session.commitTransaction();
  } catch (error) {
    console.log({ error: error.message });
    await session.abortTransaction();
  }
  console.log("leave winner logic");
  session.endSession();
};
