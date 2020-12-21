import { BracketDoc } from "../../../models/bracket";
import { PassbookDoc } from "../../../models/passbook";
import { TournamentDoc } from "../../../models/tournament";
import { UserDoc } from "../../../models/user";
import { endBracketProcess } from "./end";
import { splBracketProcess } from "./spl-bracket";

export const scoreLogger = async (
  tournament: TournamentDoc,
  brackets: BracketDoc[],
  splBracket: BracketDoc,
  users: UserDoc[]
) => {

  let updates: {
    updatedTournament: TournamentDoc;
    updatedBrackets: Array<BracketDoc>;
    updateUsers: Array<UserDoc>;
    newBrackets?: Array<BracketDoc>;
    passbooks?: Array<PassbookDoc>;
  };
  console.log("enter score logic")
  if (splBracket) updates = splBracketProcess(brackets, splBracket, users, tournament);
  else updates = endBracketProcess(brackets, users, tournament)

  return updates
};
