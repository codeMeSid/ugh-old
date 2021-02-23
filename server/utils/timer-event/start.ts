import { GameType, timer, TournamentStatus } from "@monsid/ugh-og";
import mongoose from "mongoose";
import { Tournament } from "../../models/tournament";
import { User } from "../../models/user";
import { Passbook } from "../../models/passbook";
import { TransactionEnv } from "../enum/transaction-env";
import { TransactionType } from "../enum/transaction-type";
import { shuffle } from "../shuffle";
import { randomBytes } from "crypto";
import { Bracket, BracketDoc } from "../../models/bracket";
import { TournamentTime } from "../enum/tournament-time";
import { mailer } from "../mailer";
import { MailerTemplate } from "../enum/mailer-template";
import { timerRequest } from "../timer-request";
import { TimerChannel } from "../enum/timer-channel";
import { TimerType } from "../enum/timer-type";
import { timerCancelRequest } from "../timer-request-cancel";

export const tournamentStart = async (id: string) => {
  const brackets = [];
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const tournament = await Tournament.findById(id)
      .populate("players", "email ughId settings", "Users")
      .populate("game", "gameType name cutoff", "Games")
      .session(session);

    if (!tournament) throw new Error("Invalid Tournament");
    if (tournament.status !== TournamentStatus.Upcoming)
      throw new Error("Tournament cannot be started at this stage");
    // calculate % of players in game
    const attendance =
      ((tournament.players.length * tournament.group.participants) /
        tournament.playerCount) *
      100;
    if (attendance < tournament.game.cutoff) {
      tournament.set({ status: TournamentStatus.Completed });
      const users = await User.find({
        _id: {
          $in: tournament.players.map((playerId) => playerId),
        },
      }).session(session);
      await Promise.all(
        users.map((u) => {
          u.wallet.coins += tournament.isFree ? 0 : tournament.coins;
          u.tournaments = u.tournaments.filter(
            (t) => JSON.stringify(t) !== JSON.stringify(tournament.id)
          );
          u.save({ session });
        })
      );
      await Promise.all(
        users.map((u) =>
          Passbook.build({
            coins: tournament.isFree ? 0 : tournament.coins,
            transactionEnv: TransactionEnv.TounamentCancel,
            event: Tournament?.name,
            transactionType: TransactionType.Credit,
            ughId: u.ughId,
          }).save({ session })
        )
      );

      await tournament.save({ session });
      await session.commitTransaction();
      timerCancelRequest(`T-${tournament.regId}-E`);
      users.map((user) =>
        mailer.send(
          MailerTemplate.Cancel,
          { ughId: user.ughId, tournamentName: tournament.name },
          user.email,
          "UGH Tournament Cancelled"
        )
      );
    } else {
      tournament.winnerCoin = Math.ceil(
        ((tournament.players.length * tournament.group.participants) /
          tournament.playerCount) *
          tournament.winnerCoin
      );
      // randomize players
      const users = shuffle(tournament.players);
      let i = 0;
      while (i < users.length) {
        const regId = randomBytes(4).toString("hex").substr(0, 5);
        // get teamA player
        const teamA = users[i];
        if (!teamA) break;
        let bracket: BracketDoc;
        // check for tournament game type
        switch (tournament.game.gameType) {
          case GameType.Rank:
            const uploadBy =
              (new Date(tournament.endDateTime).valueOf() - Date.now()) / 2;
            // create rank bracket with 1 player in teamA
            bracket = Bracket.build({
              teamA: {
                user: teamA,
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamA?.id] || []
                  : [],
              },
              teamB: {
                user: undefined,
              },
              gameType: GameType.Rank,
              regId,
              round: 1,
              uploadBy: new Date(Date.now() + uploadBy),
              gameName: tournament.game.name,
              tournamentName: tournament.name,
            });
            i += 1;
            break;
          case GameType.Score:
            // fetch teamB player
            const teamB = users[i + 1];
            bracket = Bracket.build({
              teamA: {
                user: teamA,
                score: -1,
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamA?.id] || []
                  : [],
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              teamB: {
                user: teamB,
                score: -1,
                teamMates: tournament?.teamMates
                  ? tournament?.teamMates[teamB?.id] || []
                  : [],
                uploadBy: new Date(
                  Date.now() + TournamentTime.TournamentScoreUpdateTime
                ),
              },
              round: 1,
              regId,
              gameType: tournament.game.gameType,
              gameName: tournament.game.name,
              tournamentName: tournament.name,
            });
            // promote teamA to next round if teamB player doesnt exist
            if (!teamB) {
              bracket.round = 2;
              bracket.teamA.uploadBy = undefined;
              bracket.teamB.uploadBy = undefined;
            } else {
              // if teamB player does exists
              // start 1hr bracket check timer
              // increase i counter to skip 2 players since a bracket uses 2 players
              const bracketCheckTime = new Date(
                new Date(bracket.teamA.uploadBy).getTime() +
                  TournamentTime.TournamentScoreCheckTime
              );
              timerRequest(bracket.regId, bracketCheckTime, {
                channel: TimerChannel.Bracket,
                type: TimerType.Check,
                eventName: {
                  regId: bracket.regId,
                  tournamentRegId: tournament.regId,
                },
              });
            }
            i += 2;
            break;
        }
        brackets.push(bracket);
        tournament.brackets.push(bracket);
      }
      // change tournament status to started
      tournament.status = TournamentStatus.Started;
      await tournament.save({ session });
      await Promise.all(brackets.map((b) => b.save({ session })));
      await session.commitTransaction();
      users.forEach((user) => {
        if (user.settings.addedTournamentWillStart)
          mailer.send(
            MailerTemplate.Start,
            {
              ughId: user.ughId,
              tournamentName: tournament.name,
            },
            user.email,
            `Tournament ${tournament.name} Started`
          );
      });
    }
  } catch (error) {
    console.log({ msg: "Start Tournament", error: error.message });
    await session.abortTransaction();
  }
  session.endSession();
  return;
};
