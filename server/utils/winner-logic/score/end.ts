import { TournamentStatus } from "@monsid/ugh-og";
import { BracketDoc } from "../../../models/bracket";
import { PassbookDoc } from "../../../models/passbook";
import { TournamentDoc } from "../../../models/tournament";
import { UserDoc } from "../../../models/user";
import { DQ } from "../../enum/dq";
import { splBracketProcess } from "./spl-bracket";

export const endBracketProcess = (
  brackets: Array<BracketDoc>,
  users: Array<UserDoc>,
  tournament: TournamentDoc
) => {
  const newBrackets: Array<BracketDoc> = [];
  const passbooks: Array<PassbookDoc> = [];
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
  ) {
    return;
  }
  let updates: {
    updatedTournament: TournamentDoc;
    updatedBrackets: Array<BracketDoc>;
    updateUsers: Array<UserDoc>;
    newBrackets?: Array<BracketDoc>;
    passbooks?: Array<PassbookDoc>;
  } = {
    updateUsers: users,
    updatedBrackets: brackets,
    updatedTournament: tournament,
    newBrackets,
    passbooks,
  };
  for (let i = 0; i < updates.updatedBrackets.length; i++) {
    const {
      teamA: { user: uA, score: sA, hasRaisedDispute: dA, uploadUrl: pA },
      teamB: { user: uB, score: sB, hasRaisedDispute: dB, uploadUrl: pB },
      winner,
    } = updates.updatedBrackets[i];

    let declaredWinner: string;

    if (!winner) {
      const ughIdA =
        users[
          users.findIndex((u) => JSON.stringify(u.id) === JSON.stringify(uA))
        ]?.ughId;
      const ughIdB =
        users[
          users.findIndex((u) => JSON.stringify(u.id) === JSON.stringify(uB))
        ]?.ughId;
      if (ughIdA && ughIdB) {
        if (sA === -1 && sB === -1) declaredWinner = DQ.ScoreNotUploaded;
        else if (sA !== -1 && sB === -1) declaredWinner = ughIdA;
        else if (sA === -1 && sB !== -1) declaredWinner = ughIdB;
        else if (dA && !pB) declaredWinner = ughIdA;
        else if (dB && !pA) declaredWinner = ughIdB;
        else if (sA > sB) declaredWinner = ughIdA;
        else if (sB > sA) declaredWinner = ughIdB;

        updates.updatedBrackets[i].winner = declaredWinner;
      }
    }
    updates = splBracketProcess(
      updates.updatedBrackets,
      updates.updatedBrackets[i],
      updates.updateUsers,
      updates.updatedTournament
    );
    newBrackets.push(...updates.newBrackets);
    passbooks.push(...updates.passbooks);
  }
  if (updates.updatedTournament.status === TournamentStatus.Started)
    updates.updatedTournament.status = TournamentStatus.Completed;
  return { ...updates, newBrackets, passbooks };
};
