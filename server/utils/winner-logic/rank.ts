import { TournamentStatus } from "@monsid/ugh";
import { BracketDoc } from "../../models/bracket";
import { TournamentDoc } from "../../models/tournament";
import { UserDoc } from "../../models/user";
import { DQ } from "../enum/dq";
import { prizeDistribution } from "../prize-distribution";

export const rankLogger = async (
  tournament: TournamentDoc,
  brackets: BracketDoc[],
  users: UserDoc[]
) => {
  const bracketWinnersCount = brackets.filter((b) => b.winner).length;
  const unresolvedDisputeCount = brackets.filter(
    (b) => b.teamB.hasRaisedDispute && !b.winner
  ).length;
  const unresolvedDisputesWithNoProofCount = brackets.filter(
    (b) => b.teamB.hasRaisedDispute && !b.winner && !b.teamA.uploadUrl
  ).length;
  const currentDateTime = Date.now();
  const tournamentEndDateTime = new Date(tournament.endDateTime).getTime();
  const isTournamentComplete = currentDateTime >= tournamentEndDateTime;
  if (
    unresolvedDisputeCount >= 1 &&
    (tournament.status === TournamentStatus.Completed ||
      isTournamentComplete) &&
    unresolvedDisputeCount !== unresolvedDisputesWithNoProofCount
  ) {
    return;
  } else if (!isTournamentComplete && brackets.length !== bracketWinnersCount) {
    return;
  }
  brackets = brackets.map((b) => {
    // TODO new condtion
    // issue player can update rank atlast minute and get away with it
    // solution auto dispute required
    if (b.teamA.score >= 1 && !b.teamB.hasRaisedDispute) {
      const userIndex = users.findIndex(
        (u) => JSON.stringify(u.id) === JSON.stringify(b.teamA.user)
      );
      b.winner = users[userIndex].ughId;
    } else if (!b.winner) b.winner = DQ.ScoreNotUploaded;
    else if (b.teamB.hasRaisedDispute && !b.teamA.uploadUrl)
      b.winner = DQ.DisputeLost;
    return b;
  });
  // filter out all the winners
  // sort the according to rank
  // take top winners as required in tournament
  const bracketWinners = brackets
    .filter(
      (b) => b.winner !== DQ.DisputeLost && b.winner !== DQ.ScoreNotUploaded
    )
    .sort((bA, bB) => bA.teamA.score - bB.teamA.score)
    .slice(0, tournament.winnerCount);

  const winnerCoins = prizeDistribution(
    tournament.winnerCoin,
    bracketWinners.length
  );

  tournament.winners = bracketWinners.map((bw, index) => {
    const userIndex = users.findIndex(
      (u) => JSON.stringify(u.id) === JSON.stringify(bw.teamA.user)
    );
    users[userIndex].tournaments = users[userIndex].tournaments.map((t) => {
      if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
        t.didWin = true;
        t.coins = winnerCoins[index];
      }
      return t;
    });
    users[userIndex].wallet.coins += winnerCoins[index];
    return {
      coins: winnerCoins[index],
      position: index + 1,
      ughId: users[userIndex]?.ughId,
    };
  });
  tournament.status = TournamentStatus.Completed;

  return {
    updatedTournament: tournament,
    updatedBrackets: brackets,
    updateUsers: users,
  };
};

// old implementation
// import { TournamentStatus } from "@monsid/ugh";
// import { BracketDoc } from "../../models/bracket";
// import { TournamentDoc } from "../../models/tournament";
// import { UserDoc } from "../../models/user";
// import { DQ } from "../enum/dq";
// import { prizeDistribution } from "../prize-distribution";

// export const rankLogger = async (
//   tournament: TournamentDoc,
//   brackets: BracketDoc[],
//   users: UserDoc[]
// ) => {
//
//   const bracketWinnersCount = brackets.filter((b) => b.winner).length;
//   const unresolvedDisputeCount = brackets.filter(
//     (b) => b.teamB.hasRaisedDispute && !b.winner
//   ).length;
//   const currentDateTime = Date.now();
//   const tournamentEndDateTime = new Date(tournament.endDateTime).getTime();
//   // check if disputes are yet to be resolved
//   if (unresolvedDisputeCount >= 1) {
//
//     return;
//   }
//   // check if match is over or if all the players have uploaded scores
//   // match is over then DQ all players whom havent uploaded rank
//   else if (
//     currentDateTime >= tournamentEndDateTime ||
//     brackets.length === bracketWinnersCount
//   ) {
//     brackets = brackets.map((b) => {
//       if (!b.winner) b.winner = DQ.ScoreNotUploaded;
//       return b;
//     });
//   } else {
//
//     return;
//   }
//   // filter out all the winners
//   // sort the according to rank
//   // take top winners as required in tournament
//   const bracketWinners = brackets
//     .filter(
//       (b) => b.winner !== DQ.DisputeLost && b.winner !== DQ.ScoreNotUploaded
//     )
//     .sort((bA, bB) => bA.teamA.score - bB.teamA.score)
//     .slice(0, tournament.winnerCount);

//   const winnerCoins = prizeDistribution(
//     tournament.winnerCoin,
//     tournament.winnerCount
//   );

//   tournament.winners = bracketWinners.map((bw, index) => {
//     const userIndex = users.findIndex(
//       (u) => JSON.stringify(u.id) === JSON.stringify(bw.teamA.user)
//     );
//     users[userIndex].tournaments = users[userIndex].tournaments.map((t) => {
//       if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
//         t.didWin = true;
//         t.coins = winnerCoins[index];
//       }
//       return t;
//     });
//     users[userIndex].wallet.coins += winnerCoins[index];
//     return {
//       coins: winnerCoins[index],
//       position: index + 1,
//       ughId: users[userIndex]?.ughId,
//     };
//   });
//   tournament.status = TournamentStatus.Completed;
//
//   return {
//     updatedTournament: tournament,
//     updatedBrackets: brackets,
//     updateUsers: users,
//   };
// };
