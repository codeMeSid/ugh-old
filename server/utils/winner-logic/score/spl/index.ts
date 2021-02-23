// check if spl bracket has winner due to dq score
//  - then go for bracket with only 1 player
//  - declare teamA player winner and promote to next round
//      - or by moving to next available bracket
//      - by create new bracket
import { BracketDoc } from "../../../../models/bracket";
import { TournamentDoc } from "../../../../models/tournament";
import { UserDoc } from "../../../../models/user";
import { TournamentTime } from "../../../enum/tournament-time";
import { createNewBracket } from "./methods/create-new-bracket";
import { getNextEmptyBracketIndex } from "./methods/empty-bracket-index";
import { getUserIndex } from "./methods/get-user-index";
import { TimerChannel } from "../../../enum/timer-channel";
import { TimerType } from "../../../enum/timer-type";
import { timerRequest } from "../../../timer-request";

interface Args {
  users: Array<UserDoc>;
  brackets: Array<BracketDoc>;
  tournament: TournamentDoc;
  nextEmptyBracketIndex: number;
  canCreateBracket: boolean;
}

interface RetType {
  brackets: Array<BracketDoc>;
  tournament: TournamentDoc;
  newBracket?: BracketDoc;
}

// if a bracket has DQ score not uploaded
// then look for bracket with single player and promote to next round
// if doesnt exist , check if it can be created. Create and promote
export const specialBracketCondition = (props: Args): RetType => {
  const {
    brackets,
    nextEmptyBracketIndex: eBI,
    tournament,
    users,
    canCreateBracket,
  } = props;
  if (eBI === -1) return { brackets, tournament };
  // get user index of next empty bracket
  const eUI = getUserIndex(users, brackets[eBI].teamA.user);

  if (eUI === -1) return { brackets, tournament };

  brackets[eBI].winner = users[eUI].ughId;
  // get next bracket index
  // to promote player declared winner in previous bracket ^
  const nEBI = getNextEmptyBracketIndex(brackets, brackets[eBI]);
  if (nEBI === -1) return { brackets, tournament };
  const userPreviousEmptyBracket = JSON.stringify(brackets[eBI].teamA.user);
  const userNextEmptyBracket = JSON.stringify(brackets[nEBI].teamA.user);

  if (nEBI !== -1 && userPreviousEmptyBracket !== userNextEmptyBracket) {
    const uploadBy = new Date(
      Date.now() + TournamentTime.TournamentScoreUpdateTime
    );
    brackets[nEBI].teamB = {
      hasRaisedDispute: false,
      score: -1,
      updateBy: undefined,
      uploadBy,
      uploadUrl: "",
      user: users[eUI],
      teamMates: brackets[eBI].teamA.teamMates,
    };
    brackets[nEBI].teamA.uploadBy = uploadBy;
    const bracketCheckTime = new Date(
      new Date(uploadBy).getTime() + TournamentTime.TournamentScoreCheckTime
    );
    timerRequest(brackets[nEBI].regId, bracketCheckTime, {
      channel: TimerChannel.Bracket,
      type: TimerType.Check,
      eventName: {
        regId: brackets[nEBI].regId,
        tournamentRegId: tournament.regId,
      },
    });
    return { brackets, tournament };
  } else if (canCreateBracket) {
    // TODO: check if futher creation is required
    const newBracket = createNewBracket(users[eUI], brackets[eBI], tournament);
    tournament.brackets.push(newBracket);
    return { brackets, tournament, newBracket };
  }
  return { brackets, tournament };
};
