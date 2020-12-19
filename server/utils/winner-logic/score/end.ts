import { BracketDoc } from "../../../models/bracket";
import { PassbookDoc } from "../../../models/passbook";
import { TournamentDoc } from "../../../models/tournament";
import { UserDoc } from "../../../models/user";
import { splBracketProcess } from "./spl-bracket";

export const endBracketProcess = (brackets: Array<BracketDoc>, users: Array<UserDoc>, tournament: TournamentDoc) => {
  
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
        passbooks
    }
    for (let i = 0; i < brackets.length; i++) {
        if (brackets[i].winner) continue;
        updates = splBracketProcess(updates.updatedBrackets, updates.updatedBrackets[i], updates.updateUsers, updates.updatedTournament);
        newBrackets.push(...updates.newBrackets);
        passbooks.push(...updates.passbooks);
    }
    return { ...updates, newBrackets, passbooks };
}