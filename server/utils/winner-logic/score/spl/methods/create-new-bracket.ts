import { randomBytes } from "crypto";
import { BracketDoc, Bracket } from "../../../../../models/bracket";
import { TournamentDoc } from "../../../../../models/tournament";
import { UserDoc } from "../../../../../models/user";

export const createNewBracket = (
  user: UserDoc,
  splBracket: BracketDoc,
  tournament: TournamentDoc
) => {
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
      teamMates: tournament?.teamMates
        ? tournament?.teamMates[user.id] || []
        : [],
    },
    teamB: {
      user: undefined,
      score: -1,
    },
  });
};
