import { BracketDoc } from "../../../models/bracket";
import { PassbookDoc } from "../../../models/passbook";
import { TournamentDoc } from "../../../models/tournament";
import { UserDoc } from "../../../models/user";
import { DQ } from "../../enum/dq";
import { specialBracketCondition } from "./spl";
import { canCreateBracketCheck } from "./spl/methods/can-create-bracket";
import { getNextEmptyBracketIndex } from "./spl/methods/empty-bracket-index";
import { getUserUghIndex } from "./spl/methods/get-user-index";
import { createNewBracket } from "./spl/methods/create-new-bracket";
import { emptySpecialBracketCondition } from "./spl/empty-bracket";

export const splBracketProcess = (
  brackets: Array<BracketDoc>,
  splBracket: BracketDoc,
  users: Array<UserDoc>,
  tournament: TournamentDoc
) => {
  const newBrackets: Array<BracketDoc> = [];
  const passbooks: Array<PassbookDoc> = [];
  const canCreateBracket = canCreateBracketCheck(brackets, tournament);
  const nextEmptyBracketIndex = getNextEmptyBracketIndex(brackets, splBracket);

  if (splBracket.winner === DQ.ScoreNotUploaded) {
    const sBUpdates = specialBracketCondition({
      brackets,
      canCreateBracket,
      nextEmptyBracketIndex,
      tournament,
      users,
    });
    brackets = sBUpdates.brackets;
    tournament = sBUpdates.tournament;
    if (sBUpdates.newBracket) {
      newBrackets.push(sBUpdates.newBracket);
    }
  } else if (nextEmptyBracketIndex !== -1) {
    brackets = emptySpecialBracketCondition({
      brackets,
      nextEmptyBracketIndex,
      splBracket,
      tournament,
      users,
    });
  } else if (canCreateBracket) {
    const splBracketWinnerIndex = getUserUghIndex(users, splBracket.winner);
    const newBracket = createNewBracket(
      users[splBracketWinnerIndex],
      splBracket,
      tournament
    );
    newBrackets.push(newBracket);
    tournament.brackets.push(newBracket);
  }
  return {
    updatedTournament: tournament,
    updatedBrackets: brackets,
    updateUsers: users,
    newBrackets,
    passbooks,
  };
};
