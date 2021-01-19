import {
  errorlog,
  GameType,
  infolog,
  timer,
  TournamentStatus,
} from "@monsid/ugh-og";
import mongoose from "mongoose";
import { Bracket, BracketDoc } from "../../models/bracket";
import { PassbookDoc } from "../../models/passbook";
import { Tournament, TournamentDoc } from "../../models/tournament";
import { User, UserDoc } from "../../models/user";
import { MailerTemplate } from "../enum/mailer-template";
import { SocketChannel } from "../enum/socket-channel";
import { SocketEvent } from "../enum/socket-event";
import { mailer } from "../mailer";
import { messenger } from "../socket";
import { rankLogger } from "./rank";
import { scoreLogger } from "./score";

export const winnerLogic = async (
  tournamentId: string,
  bracketId?: string,
  message?: string
) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  let updates: {
    updatedTournament: TournamentDoc;
    updatedBrackets: Array<BracketDoc>;
    updateUsers: Array<UserDoc>;
    newBrackets?: Array<BracketDoc>;
    passbooks?: Array<PassbookDoc>;
  };
  try {
    const tournament = await Tournament.findOne({
      regId: tournamentId,
    })
      .populate("game", "gameType name", "Games")
      .session(session);
    if (!tournament) {
      errorlog("tournament failed");
      infolog(tournamentId);
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

    switch (tournament.game.gameType) {
      case GameType.Rank:
        updates = rankLogger(tournament, brackets, users);
        if (updates)
          await Promise.all([
            updates?.updateUsers?.map((u) => u.save({ session })),
            updates?.updatedBrackets?.map((b) => b.save({ session })),
            updates?.newBrackets?.map((b) => b.save({ session })),
            updates?.passbooks?.map((p) => p.save({ session })),
            updates?.updatedTournament?.save({ session }),
          ]);
        break;
      case GameType.Score:
        updates = scoreLogger(tournament, brackets, bracket, users);
        if (updates) {
          updates?.updateUsers?.map(async (u) => await u.save({ session }));
          updates?.updatedBrackets?.map(async (b) => await b.save({ session }));
          updates?.newBrackets?.map(async (b) => await b.save({ session }));
          updates?.passbooks?.map(async (p) => await p.save({ session }));
          await updates?.updatedTournament?.save({ session });
        }
        break;
    }

    await session.commitTransaction();
  } catch (error) {
    console.log({ msg: "winner logic", error: error.message });
    await session.abortTransaction();
  }
  if (updates) {
    sendNotification(updates.updatedTournament, updates.updatedBrackets);
    sendEmail(updates.updatedTournament, updates.updateUsers);
    sendUpdates(updates.updatedTournament.regId);
  }
  session.endSession();
  return;
};

const sendNotification = (tournament: any, brackets: any) => {
  try {
    if (tournament.status === TournamentStatus.Completed) {
      timer.cancel(`${tournament.regId}-end`);
      brackets.forEach((bracket: any) => {
        const bracketId = bracket.regId;
        timer.cancel(`${bracketId}`);
        timer.cancel(`${bracketId}-A`);
        timer.cancel(`${bracketId}-B`);
        timer.cancel(`${bracketId}-check`);
      });
      messenger.io
        .to(SocketChannel.BracketRank)
        .emit(SocketEvent.EventRecieve, {
          by: "UGH",
          tournamentId: tournament.regId,
          type: "over",
          channel: SocketChannel.BracketRank,
        });
    }
  } catch (error) {
    console.error(error?.message);
  }
  return;
};
const sendEmail = (tournament: any, users: any) => {
  try {
    const { name, winners } = tournament;
    if (winners.length > 0)
      users.forEach((user: any) => {
        const { ughId } = user;
        const userIndex = winners.findIndex((w: any) => w?.ughId === ughId);
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
            { ughId, tournamentName: name, opponentUghId: winners[0]?.ughId },
            user.email,
            "UGH Tournament Better Luck Next Time !!!"
          );
      });
  } catch (error) {
    console.error(error?.message);
  }
  return;
};
const sendUpdates = (regId: string) => {
  try {
    messenger.io.to(SocketChannel.BracketRank).emit(SocketEvent.EventRecieve, {
      by: "UGH",
      tournamentId: regId,
      type: "update",
      channel: SocketChannel.BracketRank,
    });
  } catch (error) {
    console.error(error?.message);
  }
  return;
};
