import { Request, Response } from "express";
import { Tournament, TournamentDoc } from "../../../models/tournament";
import {
  BadRequestError,
  GameType,
  UserActivity,
  UserRole,
} from "@monsid/ugh-og";
import { Game } from "../../../models/game";
import mongoose from "mongoose";
import { Settings } from "../../../models/settings";
import { User } from "../../../models/user";
import { randomBytes } from "crypto";
import { fire } from "../../../utils/firebase";
import { timerRequest } from "../../../utils/timer-request";
import { TimerChannel } from "../../../utils/enum/timer-channel";
import { TimerType } from "../../../utils/enum/timer-type";

export const tournamentAddController = async (req: Request, res: Response) => {
  const {
    name,
    coins,
    winnerCount,
    startDateTime,
    endDateTime,
    game: gameId,
    playerCount,
    group,
    isFree,
    teamPlayers,
  } = req.body;
  const { role, ughId } = req.currentUser;
  const msIn1Hr = 1000 * 60 * 60;
  const sdt = new Date(startDateTime).valueOf();
  const edt = new Date(endDateTime).valueOf();
  const cdt = new Date().valueOf();
  const wc = winnerCount;
  const pc = playerCount;
  const cUser = req.currentUser;
  const playersInGroup = group.participants;

  if (sdt <= cdt) throw new BadRequestError("Tournament cannot be in the past");
  if (sdt - cdt < msIn1Hr && role !== UserRole.Admin)
    throw new BadRequestError("Schedule atleast 1hr ahead");
  if (edt <= sdt) throw new BadRequestError("Cannot finish before Start");
  if (edt - sdt < msIn1Hr)
    throw new BadRequestError("Tournament duration should be atleast 1 hour");
  if (wc >= pc) throw new BadRequestError("Winner cannot be more than players");
  if (playerCount % playersInGroup !== 0)
    throw new BadRequestError("Insufficient player slots");
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const game = await Game.findById(gameId).session(session);
    const settings = await Settings.findOne().session(session);
    const user = await User.findById(cUser.id).session(session);
    if (!game) throw new BadRequestError("Invalid game");
    if (!settings) throw new BadRequestError("Settings not upto date");
    if (!user) throw new BadRequestError("Invalid user");
    const newEndDateTime = new Date(
      new Date(endDateTime).valueOf() +
        (game.gameType === GameType.Score ? 1000 * 60 * 30 : 0)
    );
    const totalWinnings = parseInt(playerCount) * parseInt(coins);
    const earning = Math.round((settings.tournamentFees / 100) * totalWinnings);
    const winnerCoin = totalWinnings - (isFree ? 0 : earning);
    const tournament = Tournament.build({
      addedBy: {
        id: user.id,
        name: user.name,
        role: user.role,
        ughId: user.ughId,
      },
      coins: parseInt(coins),
      endDateTime: newEndDateTime,
      game,
      name,
      group,
      regId: randomBytes(4).toString("hex").substr(0, 5),
      playerCount: parseInt(playerCount),
      winnerCoin,
      startDateTime: new Date(startDateTime),
      isFree,
      winnerCount: parseInt(winnerCount),
    });
    tournament.coins *= tournament.group.participants;
    if (cUser.role === UserRole.Player) {
      if (!user) throw new BadRequestError("Invalid user");
      const balance = user.wallet.coins;
      const fees = tournament.coins;
      if (balance - fees < 0)
        throw new BadRequestError("Insufficient balance to create tournament");
      user.wallet.coins -= fees;
      user.tournaments.push({
        id: tournament.id,
        didWin: false,
        coins: winnerCoin,
        name: tournament.name,
        startDateTime: tournament.startDateTime,
        endDateTime: tournament.endDateTime,
        game: game.name,
      });
      tournament.players.push(user);
      if (teamPlayers) {
        const team = {
          ...(tournament.teamMates || {}),
          [user.id]: teamPlayers,
        };
        tournament.teamMates = team;
      }
    }
    await user.save({ session });
    await tournament.save({ session });
    await session.commitTransaction();

    timerRequest(`T-${tournament.regId}-S`, tournament.startDateTime, {
      channel: TimerChannel.Tournament,
      type: TimerType.Start,
      eventName: {
        id: tournament.id,
      },
    });

    timerRequest(`T-${tournament.regId}-E`, tournament.endDateTime, {
      channel: TimerChannel.Tournament,
      type: TimerType.End,
      eventName: {
        id: tournament.id,
      },
    });

    sendTournamentAddedMail(tournament, ughId);
  } catch (error) {
    await session.abortTransaction();
    throw new BadRequestError(error.message);
  }
  session.endSession();
  res.send(true);
};

const sendTournamentAddedMail = async (
  tournament: TournamentDoc,
  ughId: string
) => {
  const users = await User.find({
    "settings.newTournamentWasAdded": true,
    activity: UserActivity.Active,
  });
  users.forEach((user) => {
    if (user.fcmToken && user.ughId !== ughId) {
      fire.sendNotification(
        user.fcmToken,
        "New Tournament Added",
        `/tournaments/${tournament.regId}`
      );
    }
  });
};
