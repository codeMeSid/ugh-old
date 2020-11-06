import {
  errorlog,
  GameType,
  infolog,
  timer,
  TournamentStatus,
} from "@monsid/ugh";
import mongoose from "mongoose";
import { Bracket, BracketDoc } from "../../models/bracket";
import { Tournament, TournamentDoc } from "../../models/tournament";
import { User, UserDoc } from "../../models/user";
import { MailerTemplate } from "../enum/mailer-template";
import { mailer } from "../mailer";
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
      infolog(tournamentId);
      return;
    }
    if (tournament.winners.length >= 1) {
      console.log("tournament already has winner");
      return;
    }
    const users = await User.find({ _id: { $in: tournament.players } }).session(
      session
    );
    const brackets = await Bracket.find({
      _id: { $in: tournament.brackets },
    }).session(session);
    const bracket = await Bracket.findOne({ regId: bracketId }).session(
      session
    );
    if (brackets.length === 0) {
      console.log("No Brackets");
      return;
    }
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
        updates.updatedTournament.save({ session }),
      ]);
    }

    await session.commitTransaction();
    if (
      updates &&
      updates.updatedTournament.status === TournamentStatus.Completed
    )
      timer.cancel(`${tournament.regId}-end`);
    if (updates) {
      const { updateUsers, updatedTournament } = updates;
      const { name, winners } = updatedTournament;
      updateUsers.forEach((user) => {
        const { ughId } = user;
        const userIndex = winners.findIndex((w) => w.ughId === ughId);
        if (userIndex >= 0)
          mailer.send(
            MailerTemplate.Win,
            {
              ughId,
              tournamentName: name,
              prize: winners[userIndex].coins,
            },
            user.email,
            "UGH TOURNAMENT WINNER"
          );
        else
          mailer.send(
            MailerTemplate.Winner,
            { ughId, tournamentName: name, opponentUghId: winners[0].ughId },
            user.email,
            "UGH Tournament Better Luck Next Time !!!"
          );
      });
    }
  } catch (error) {
    console.log({ error: error.message });
    await session.abortTransaction();
  }
  console.log("leave winner logic");
  session.endSession();
};
