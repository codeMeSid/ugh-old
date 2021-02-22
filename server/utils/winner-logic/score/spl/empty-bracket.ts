import { BracketDoc } from "../../../../models/bracket";
import { TournamentDoc } from "../../../../models/tournament";
import { UserDoc } from "../../../../models/user";
import { bracketCheckTimer } from "../../../bracket-check-timer";
import { TournamentTime } from "../../../enum/tournament-time";
import { getUserUghIndex } from "./methods/get-user-index";

interface Args {
  users: Array<UserDoc>;
  splBracket: BracketDoc;
  brackets: Array<BracketDoc>;
  tournament: TournamentDoc;
  nextEmptyBracketIndex: number;
}

// check if next round empty bracket is available
//  - then shift the player to that bracket
//      - start check timer
export const emptySpecialBracketCondition = (
  props: Args
): Array<BracketDoc> => {
  const {
    brackets,
    splBracket,
    tournament,
    users,
    nextEmptyBracketIndex: eBI,
  } = props;
  const wUI = getUserUghIndex(users, splBracket.winner);

  if (wUI === -1) return brackets;

  const uploadBy = new Date(
    Date.now() + TournamentTime.TournamentScoreUpdateTime
  );
  // TODO: assigns team mates
  brackets[eBI].teamB = {
    hasRaisedDispute: false,
    score: -1,
    updateBy: undefined,
    uploadBy,
    uploadUrl: "",
    user: users[wUI],
    teamMates: tournament.teamMates
      ? tournament.teamMates[users[wUI]?.id] || []
      : [],
  };

  brackets[eBI].teamA.uploadBy = uploadBy;
  const bracketCheckTime = new Date(
    new Date(uploadBy).getTime() + TournamentTime.TournamentScoreCheckTime
  );

  bracketCheckTimer(brackets[eBI].regId, bracketCheckTime, tournament.regId);

  return brackets;
};
