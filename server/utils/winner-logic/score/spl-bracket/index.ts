import { TournamentStatus } from "@monsid/ugh-og"
import { randomBytes } from "crypto";
import { Bracket, BracketDoc } from "../../../../models/bracket";
import { Passbook, PassbookDoc } from "../../../../models/passbook";
import { TournamentDoc } from "../../../../models/tournament";
import { UserDoc } from "../../../../models/user";
import { bracketCheckTimer } from "../../../bracket-check-timer";
import { DQ } from "../../../enum/dq";
import { TournamentTime } from '../../../enum/tournament-time'
import { TransactionEnv } from "../../../enum/transaction-env";
import { TransactionType } from "../../../enum/transaction-type";
import { prizeDistribution } from "../../../prize-distribution";

export const splBracketProcess = (brackets: Array<BracketDoc>, splBracket: BracketDoc, users: Array<UserDoc>, tournament: TournamentDoc) => {
    console.log("enter score spl bracket")
    const newBrackets: Array<BracketDoc> = [];
    const passbooks: Array<PassbookDoc> = [];
    const canCreateBracket = canCreateBracketCheck(brackets, tournament);
    const nextEmptyBracketIndex = getNextEmptyBracketIndex(brackets, splBracket);
    const splBracketWinnerIndex = getUserUghIndex(users, splBracket.winner);
    // check if spl bracket has winner due to dq score 
    //  - then go for bracket with only 1 player 
    //  - declare teamA player winner and promote to next round
    //      - or by moving to next available bracket
    //      - by create new bracket
    if (splBracket.winner === DQ.ScoreNotUploaded) {
        console.log("enter score spl bracket no score")
        if (nextEmptyBracketIndex !== -1) {

            const emptyBracketUserIndex = getUserIndex(users, brackets[nextEmptyBracketIndex].teamA.user);
            if (emptyBracketUserIndex !== -1) {
                brackets[nextEmptyBracketIndex].winner = users[emptyBracketUserIndex].ughId;
                const nextPlayEmptyBracketIndex = getNextEmptyBracketIndex(brackets, brackets[nextEmptyBracketIndex]);
                if (nextPlayEmptyBracketIndex !== -1) {
                    console.log("enter score spl bracket no score shift other player existing bracket")

                    const uploadBy = new Date(
                        Date.now() + TournamentTime.TournamentScoreUpdateTime
                    )
                    brackets[nextPlayEmptyBracketIndex].teamB = {
                        hasRaisedDispute: false,
                        score: -1,
                        updateBy: undefined,
                        uploadBy,
                        uploadUrl: "",
                        user: users[emptyBracketUserIndex]
                    }
                    brackets[nextPlayEmptyBracketIndex].teamA.uploadBy = uploadBy;
                    const bracketCheckTime = new Date(
                        new Date(uploadBy).getTime() +
                        TournamentTime.TournamentScoreCheckTime
                    );
                    bracketCheckTimer(brackets[nextPlayEmptyBracketIndex].regId, bracketCheckTime, tournament.regId);
                }
                else if (canCreateBracket) {
                    console.log("enter score spl bracket no score shift other player new bracket")

                    const newBracket = createNewBracket(users[emptyBracketUserIndex], brackets[nextEmptyBracketIndex]);
                    newBrackets.push(newBracket);
                    tournament.brackets.push(newBracket);
                }
            }
        }
    }
    // check if next round empty bracket is available
    //  - then shift the player to that bracket 
    //      - start check timer
    else if (nextEmptyBracketIndex !== -1) {
        console.log("enter score spl bracket shift to existing bracket");
        if (splBracketWinnerIndex !== -1) {
            const uploadBy = new Date(
                Date.now() + TournamentTime.TournamentScoreUpdateTime
            )
            brackets[nextEmptyBracketIndex].teamB = {
                hasRaisedDispute: false,
                score: -1,
                updateBy: undefined,
                uploadBy,
                uploadUrl: "",
                user: users[splBracketWinnerIndex]
            }
            brackets[nextEmptyBracketIndex].teamA.uploadBy = uploadBy;
            const bracketCheckTime = new Date(
                new Date(uploadBy).getTime() +
                TournamentTime.TournamentScoreCheckTime
            );
            bracketCheckTimer(brackets[nextEmptyBracketIndex].regId, bracketCheckTime, tournament.regId);
        }
    }
    // check if no empty bracket exists 
    //  - create new bracket
    else if (canCreateBracket) {
        console.log("enter score spl bracket shift to new bracket");

        const splBracketWinnerIndex = getUserUghIndex(users, splBracket.winner);
        const newBracket = createNewBracket(users[splBracketWinnerIndex], splBracket);
        newBrackets.push(newBracket);
        tournament.brackets.push(newBracket);
    }
    // check if next bracket doesnt exists and new bracket cannot be created
    //  - process all brackets to declare winner
    else {
        console.log("enter score spl bracket winner declaration");

        const sortedBrackets = brackets.sort((a, b) => b.round - a.round);
        const winnerBracket = sortedBrackets[0];
        const winnerCoins = prizeDistribution(
            tournament.winnerCoin,
            tournament.winnerCount
        );
        const winner1UserIndex = getUserUghIndex(users, winnerBracket.winner);

        if (winner1UserIndex !== -1) {
            tournament.winners.push({
                coins: winnerCoins[0],
                position: 1,
                ughId: users[winner1UserIndex].ughId
            });
            users[winner1UserIndex].tournaments =
                users[winner1UserIndex].tournaments.map(t => {
                    if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
                        t.coins = winnerCoins[0];
                        t.didWin = true;
                    }
                    return t;
                });
            // users[winner1UserIndex].wallet.coins += winnerCoins[0];
        }
        if (tournament.winnerCount === 2) {
            const winner2User = JSON.stringify(users[winner1UserIndex].id) === JSON.stringify(splBracket.teamA.user) ? splBracket.teamB.user : splBracket.teamA.user;
            const winner2UserIndex = getUserIndex(users, winner2User);

            if (winner2UserIndex !== -1) {
                tournament.winners.push({
                    coins: winnerCoins[1],
                    position: 1,
                    ughId: users[winner2UserIndex].ughId
                });
                users[winner2UserIndex].tournaments =
                    users[winner2UserIndex].tournaments.map(t => {
                        if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
                            t.coins = winnerCoins[1];
                            t.didWin = true;
                        }
                        return t;
                    });
                // users[winner2UserIndex].wallet.coins += winnerCoins[1];
            }
        }

        tournament.status = TournamentStatus.Completed;
        tournament.winners.forEach(w => passbooks.push(Passbook.build({
            coins: w.coins,
            event: tournament?.name,
            transactionEnv: TransactionEnv.TournamentWin,
            transactionType: TransactionType.Credit,
            ughId: w?.ughId,
        })));
    }
    return {
        updatedTournament: tournament,
        updatedBrackets: brackets,
        updateUsers: users,
        newBrackets,
        passbooks
    }
}

const canCreateBracketCheck = (brackets: Array<BracketDoc>, tournament: TournamentDoc) => tournament.players.length - 1 > brackets.length

const getNextEmptyBracketIndex = (brackets: Array<BracketDoc>, splBracket: BracketDoc) =>
    brackets.findIndex(b => b.round === splBracket.round + 1 && !b.teamB.user);

const getUserIndex = (users: Array<UserDoc>, userId: any) => users.findIndex(u => JSON.stringify(u.id) === JSON.stringify(userId));

const getUserUghIndex = (users: Array<UserDoc>, ughId: string) => users.findIndex(u => u.ughId === ughId);


const createNewBracket = (user: UserDoc, splBracket: BracketDoc) => {
    const regId = randomBytes(4).toString("hex").substr(0, 5);
    return Bracket.build({
        regId,
        gameName: splBracket.gameName,
        gameType: splBracket.gameType,
        tournamentName: splBracket.tournamentName,
        round: splBracket.round + 1,
        teamA: {
            user,
            score: -1,
        },
        teamB: {
            user: undefined,
            score: -1
        },
    })
}