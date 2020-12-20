import { GameType, timer, TournamentStatus } from "@monsid/ugh-og"
import mongoose from 'mongoose';
import { Tournament } from "../../../models/tournament";
import { User } from "../../../models/user";
import { Passbook } from '../../../models/passbook'
import { TransactionEnv } from "../../../utils/enum/transaction-env";
import { TransactionType } from "../../../utils/enum/transaction-type";
import { shuffle } from '../../../utils/shuffle';
import { randomBytes } from "crypto";
import { Bracket, BracketDoc } from "../../../models/bracket";
import { TournamentTime } from '../../../utils/enum/tournament-time';
import { winnerLogic } from '../../../utils/winner-logic'
import { mailer } from "../../../utils/mailer";
import { MailerTemplate } from "../../../utils/enum/mailer-template";
import { DQ } from "../../../utils/enum/dq";
import { bracketCheckTimer } from "../../../utils/bracket-check-timer";

export const tournamentStartTimer = (regId: string, id: string, startDateTime: Date) => timer.schedule(
    regId,
    new Date(startDateTime),
    async ({ id }: { id: string }) => {

        const brackets = [];
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const tournament = await Tournament.findById(id)
                .populate("players", "email ughId settings", "Users")
                .populate("game", "gameType name cutoff", "Games")
                .session(session);

            if (!tournament) throw new Error("Invalid Tournament");
            if (tournament.status !== TournamentStatus.Upcoming) throw new Error("Tournament cannot be started at this stage");
            // calculate % of players in game
            const attendance =
                ((tournament.players.length * tournament.group.participants) /
                    tournament.playerCount) *
                100;
            // if attendance less than minimum then cancel tournament
            // tournament status => completed
            // return all players entry coins - if paid
            if (attendance < tournament.game.cutoff) {

                tournament.set({ status: TournamentStatus.Completed });
                const users = await User.find({
                    _id: {
                        $in: tournament.players.map((playerId) => playerId),
                    },
                }).session(session);
                await Promise.all([
                    // return entry coins
                    // make entry in passbook
                    users.map(async (user) => {
                        user.wallet.coins = user.wallet.coins + (tournament?.isFree ? 0 : tournament?.coins);
                        user.tournaments = user.tournaments.filter(t =>
                            JSON.stringify(t) !== JSON.stringify(tournament.id)
                        );
                        const passbook = Passbook.build({
                            coins: tournament?.isFree ? 0 : tournament?.coins,
                            transactionEnv: TransactionEnv.TounamentCancel,
                            event: Tournament?.name,
                            transactionType: TransactionType.Credit,
                            ughId: user.ughId
                        })
                        return [user.save({ session }), passbook.save({ session })]
                    }),
                    tournament.save({ session })
                ]);
                await session.commitTransaction();
            } else {
                // randomize players
                const users = shuffle(tournament.players);
                let i = 0;
                while (i < users.length) {
                    const regId = randomBytes(4).toString("hex").substr(0, 5);
                    // get teamA player
                    const teamA = users[i]
                    if (!teamA) break;
                    let bracket: BracketDoc;
                    // check for tournament game type
                    switch (tournament.game.gameType) {
                        case GameType.Rank:
                            const uploadBy = (new Date(tournament.endDateTime).valueOf() - Date.now()) / 2;
                            // create rank bracket with 1 player in teamA
                            bracket = Bracket.build({
                                teamA: {
                                    user: teamA,
                                },
                                teamB: {
                                    user: undefined,
                                },
                                gameType: GameType.Rank,
                                regId,
                                round: 1,
                                uploadBy: new Date(Date.now() + uploadBy),
                                gameName: tournament.game.name,
                                tournamentName: tournament.name
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
                                    uploadBy: new Date(
                                        Date.now() + TournamentTime.TournamentScoreUpdateTime
                                    ),
                                },
                                teamB: {
                                    user: teamB,
                                    score: -1,
                                    uploadBy: new Date(
                                        Date.now() + TournamentTime.TournamentScoreUpdateTime
                                    ),
                                },
                                round: 1,
                                regId,
                                gameType: tournament.game.gameType,
                                gameName: tournament.game.name,
                                tournamentName: tournament.name
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
                                bracketCheckTimer(bracket.regId, bracketCheckTime, tournament.regId);
                            }
                            i += 2;
                            break;
                    }
                    brackets.push(bracket);
                    tournament.brackets.push(bracket);
                }
                // change tournament status to started
                tournament.status = TournamentStatus.Started;
                await Promise.all([
                    tournament.save({ session }),
                    brackets?.map(async (b) => b.save({ session })),
                ]);
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
            console.log({ m: "start", error: error.message });
            await session.abortTransaction();
        }
        session.endSession();
    },
    { id }
);