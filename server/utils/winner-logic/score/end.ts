import { TournamentStatus } from "@monsid/ugh-og";
import { BracketDoc } from "../../../models/bracket";
import { PassbookDoc } from "../../../models/passbook";
import { TournamentDoc } from "../../../models/tournament";
import { UserDoc } from "../../../models/user";
import { DQ } from "../../enum/dq";
import { endSpecialBracketCondition } from "./spl/end-bracket";

export const endBracketProcess = (
  brackets: Array<BracketDoc>,
  users: Array<UserDoc>,
  tournament: TournamentDoc
) => {
  const unresolvedDispute = brackets.filter(
    (b) => (b?.teamA.hasRaisedDispute || b?.teamB.hasRaisedDispute) && !b.winner
  );
  const unresolvedDisputeCount = unresolvedDispute.length;
  const unresolvedDisputesWithNoProofCount = unresolvedDispute.filter(
    (b) => !b?.teamA.uploadUrl && !b.teamB.uploadUrl
  ).length;
  if (
    unresolvedDisputeCount >= 1 &&
    unresolvedDisputeCount !== unresolvedDisputesWithNoProofCount
  ) {
    return;
  }
  brackets = brackets.map((bracket) => {
    const {
      teamA: { user: uA, score: sA, hasRaisedDispute: dA, uploadUrl: pA },
      teamB: { user: uB, score: sB, hasRaisedDispute: dB, uploadUrl: pB },
      winner,
    } = bracket;
    let declaredWinner: string;

    if (winner) return bracket;
    const ughIdA =
      users[users.findIndex((u) => JSON.stringify(u.id) === JSON.stringify(uA))]
        ?.ughId;
    const ughIdB =
      users[users.findIndex((u) => JSON.stringify(u.id) === JSON.stringify(uB))]
        ?.ughId;
    if (ughIdA && !ughIdB) declaredWinner = ughIdA;
    else if (ughIdA && ughIdB) {
      if (sA === -1 && sB === -1) declaredWinner = DQ.ScoreNotUploaded;
      else if (sA !== -1 && sB === -1) declaredWinner = ughIdA;
      else if (sA === -1 && sB !== -1) declaredWinner = ughIdB;
      else if (dA && !pB) declaredWinner = ughIdA;
      else if (dB && !pA) declaredWinner = ughIdB;
      else if (sA > sB) declaredWinner = ughIdA;
      else if (sB > sA) declaredWinner = ughIdB;
    }
    bracket.winner = declaredWinner;
    return bracket;
  });

  const updates = endSpecialBracketCondition({
    brackets,
    tournament,
    users,
  });

  return updates;
};
