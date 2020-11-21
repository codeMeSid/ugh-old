import { TournamentStatus } from "@monsid/ugh";
import { randomBytes } from "crypto";
import { Bracket, BracketDoc } from "../../models/bracket";
import { TournamentDoc } from "../../models/tournament";
import { UserDoc } from "../../models/user";
import { DQ } from "../enum/dq";
import { TournamentTime } from "../enum/tournament-time";
import { prizeDistribution } from "../prize-distribution";

export const scoreLogger = async (
  tournament: TournamentDoc,
  brackets: BracketDoc[],
  splBracket: BracketDoc,
  users: UserDoc[]
) => {
  console.log("score");
  const newBrackets: Array<any> = [];
  const requiredBracketCount = tournament.players.length - 1;
  const canCreateBracket = requiredBracketCount > brackets.length;
  if (splBracket && splBracket.winner !== DQ.ScoreNotUploaded) {
    console.log("spl bracket");
    const nextBracketIndex = brackets.findIndex(
      (b) => b.round === splBracket.round + 1 && !b.teamB.user
    );
    const userIndex = users.findIndex(
      (user) => user.ughId === splBracket.winner
    );
    if (nextBracketIndex !== -1) {
      console.log("next bracket");
      const uploadBy = new Date(
        Date.now() + TournamentTime.TournamentScoreUpdateTime
      );
      brackets[nextBracketIndex].teamB = {
        user: users[userIndex],
        uploadBy,
        hasRaisedDispute: false,
        score: -1,
        updateBy: undefined,
        uploadUrl: "",
      };
      brackets[nextBracketIndex].teamA.uploadBy = uploadBy;
    } else if (canCreateBracket) {
      console.log("new bracket");
      const regId = randomBytes(4).toString("hex").substr(0, 5);
      const newBracket = Bracket.build({
        gameType: splBracket.gameType,
        regId,
        round: splBracket.round + 1,
        teamA: {
          user: users[userIndex],
          score: -1,
        },
        teamB: {
          user: undefined,
          score: -1,
        },
      });
      tournament.brackets.push(newBracket);
      newBrackets.push(newBracket);
    } else {
      console.log("winner declaration");
      const sortedBrackets = brackets.sort((a, b) => b.round - a.round);
      const winnerBracket = sortedBrackets[0];
      const winnerCoins = prizeDistribution(
        tournament.winnerCoin,
        tournament.winnerCount
      );
      const winner1Index = users.findIndex(
        (u) => u.ughId === winnerBracket.winner
      );

      tournament.winners = [
        {
          coins: winnerCoins[0],
          position: 1,
          ughId: users[winner1Index].ughId,
        },
      ];
      users[winner1Index].tournaments = users[userIndex].tournaments.map(
        (t) => {
          if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
            t.didWin = true;
            t.coins = winnerCoins[0];
          }
          return t;
        }
      );
      users[winner1Index].wallet.coins += winnerCoins[0];
      if (tournament.winnerCount === 2) {
        const jA = JSON.stringify(winnerBracket.teamA.user);
        const jB = JSON.stringify(winnerBracket.teamB.user);
        const jW = JSON.stringify(users[winner1Index].id);
        const winner2: any = jA === jW ? jB : jA;
        const winner2Index = users.findIndex(
          (u) => JSON.stringify(u.id) === winner2
        );
        tournament.winners = [
          ...tournament.winners,
          {
            coins: winnerCoins[1],
            position: 2,
            ughId: users[winner2Index].ughId,
          },
        ];
        users[winner2Index].tournaments = users[userIndex].tournaments.map(
          (t) => {
            if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
              t.didWin = true;
              t.coins = winnerCoins[1];
            }
            return t;
          }
        );
        users[winner2Index].wallet.coins += winnerCoins[1];
      }
      tournament.status = TournamentStatus.Completed;
    }
  } else if (!splBracket) {
    console.log("tournament over");
    const unresolvedDispute = brackets.filter(
      (b) => (b.teamA.hasRaisedDispute || b.teamB.hasRaisedDispute) && !b.winner
    );
    const unresolvedDisputeCount = unresolvedDispute.length;
    const unresolvedDisputesWithNoProofCount = unresolvedDispute.filter(
      (b) => !b.teamA.uploadUrl && !b.teamB.uploadUrl
    ).length;
    if (
      unresolvedDisputeCount >= 1 &&
      unresolvedDisputeCount !== unresolvedDisputesWithNoProofCount
    )
      return;
    for (let bIndex = 0; bIndex < brackets.length; bIndex++) {
      const {
        winner,
        teamA: { score: sA, hasRaisedDispute: dA, user: uA, uploadUrl: uuA },
        teamB: { score: sB, hasRaisedDispute: dB, user: uB, uploadUrl: uuB },
      } = brackets[bIndex];
      if (winner) continue;
      const jA = JSON.stringify(uA);
      const jB = JSON.stringify(uB);
      const userAIndex = users.findIndex((u) => JSON.stringify(u.id) === jA);
      const userBIndex = users.findIndex((u) => JSON.stringify(u.id) === jB);
      let bWinner: string;

      if (userBIndex === -1) bWinner = users[userAIndex].ughId;
      else if (sA === -1 && sB === -1) {
        brackets[bIndex].winner = DQ.ScoreNotUploaded;
        continue;
      } else if (sB === -1) bWinner = users[userAIndex].ughId;
      else if (dA && !uuB) bWinner = users[userAIndex].ughId;
      else if (sA === -1) bWinner = users[userBIndex].ughId;
      else if (dB && !uuA) bWinner = users[userBIndex].ughId;

      brackets[bIndex].winner = bWinner;
      console.log("score stack enter");
      let {
        updateUsers,
        updatedBrackets,
        updatedTournament,
        newBrackets: nBs,
      } = await scoreLogger(tournament, brackets, brackets[bIndex], users);
      users = updateUsers;
      brackets = updatedBrackets;
      tournament = updatedTournament;
      if (nBs.length >= 1) newBrackets.push(...nBs);
      console.log("score stack leave");
    }
  }
  console.log("leave score");
  return {
    updatedTournament: tournament,
    updatedBrackets: brackets,
    updateUsers: users,
    newBrackets,
  };
};
