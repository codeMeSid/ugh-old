import { TournamentStatus } from "@monsid/ugh-og";
import { BracketDoc } from "../../../../models/bracket";
import { Passbook, PassbookDoc } from "../../../../models/passbook";
import { TournamentDoc } from "../../../../models/tournament";
import { UserDoc } from "../../../../models/user";
import { DQ } from "../../../enum/dq";
import { TransactionEnv } from "../../../enum/transaction-env";
import { TransactionType } from "../../../enum/transaction-type";
import { prizeDistribution } from "../../../prize-distribution";
import { getUserIndex, getUserUghIndex } from "./methods/get-user-index";

interface Args {
  brackets: Array<BracketDoc>;
  tournament: TournamentDoc;
  users: Array<UserDoc>;
}
interface RetType {
  updatedTournament: TournamentDoc;
  updatedBrackets: Array<BracketDoc>;
  updateUsers: Array<UserDoc>;
  newBrackets?: Array<BracketDoc>;
  passbooks?: Array<PassbookDoc>;
}
export const endSpecialBracketCondition = (props: Args): RetType => {
  const passbooks: Array<PassbookDoc> = [];
  const { brackets, tournament, users } = props;

  const sortedBrackets = brackets.sort((a, b) => b.round - a.round);

  const winnerBracket = sortedBrackets[0];
  if (
    winnerBracket.winner === DQ.AdminDQ ||
    winnerBracket.winner === DQ.ScoreNotUploaded
  )
    return {
      updatedBrackets: brackets,
      passbooks,
      updatedTournament: tournament,
      updateUsers: users,
      newBrackets: [],
    };

  const winnerCoins = prizeDistribution(
    tournament.winnerCoin,
    tournament.winnerCount
  );

  const w1UI = getUserUghIndex(users, winnerBracket.winner);

  if (w1UI === -1) {
    return {
      updatedBrackets: brackets,
      passbooks,
      updatedTournament: tournament,
      updateUsers: users,
      newBrackets: [],
    };
  }
  tournament.winners.push({
    coins: winnerCoins[0],
    position: 1,
    ughId: users[w1UI].ughId,
  });

  users[w1UI].tournaments = users[w1UI].tournaments.map((t) => {
    if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
      t.coins = winnerCoins[0];
      t.didWin = true;
    }
    return t;
  });
  if (tournament.winnerCount === 2) {
    const winner2User =
      JSON.stringify(users[w1UI].id) ===
      JSON.stringify(winnerBracket.teamA.user)
        ? winnerBracket.teamB.user
        : winnerBracket.teamA.user;
    const w2UI = getUserIndex(users, winner2User);
    if (w2UI !== -1) {
      tournament.winners.push({
        coins: winnerCoins[1],
        position: 2,
        ughId: users[w2UI]?.ughId,
      });
      users[w2UI].tournaments = users[w2UI].tournaments.map((t) => {
        if (JSON.stringify(t.id) === JSON.stringify(tournament.id)) {
          t.coins = winnerCoins[1];
          t.didWin = true;
        }
        return t;
      });
    }
  }
  tournament.status = TournamentStatus.Completed;
  tournament.winners.forEach((w) =>
    passbooks.push(
      Passbook.build({
        coins: w.coins,
        event: tournament?.name,
        transactionEnv: TransactionEnv.TournamentWin,
        transactionType: TransactionType.Credit,
        ughId: w?.ughId,
      })
    )
  );

  return {
    updatedBrackets: brackets,
    passbooks,
    updatedTournament: tournament,
    updateUsers: users,
    newBrackets: [],
  };
};
