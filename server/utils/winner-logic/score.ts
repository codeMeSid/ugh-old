import { BracketDoc } from "../../models/bracket";
import { TournamentDoc } from "../../models/tournament";
import { UserDoc } from "../../models/user";

// check if splBracket exists
// if yes - check for winner status
// if exists - find another bracket with round+1
// if that exists and has not teamB , assign and update timers
// else check for length of brackets in tournament
// if length === 1+2+4(example 8 participants) then allot appropriate winners
// else create new bracket and assign the winner to teamA
export const scoreLogger = async (
  tournament: TournamentDoc,
  brackets: BracketDoc[],
  splBracket: BracketDoc,
  users: UserDoc[]
) => {
  console.log("score");
  return {
    updatedTournament: tournament,
    updatedBrackets: brackets,
    updateUsers: users,
  };
};
