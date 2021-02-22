import { BracketDoc } from "../../../../../models/bracket";

export const getNextEmptyBracketIndex = (
  brackets: Array<BracketDoc>,
  splBracket: BracketDoc
) =>
  brackets.findIndex((b) => b.round === splBracket.round + 1 && !b.teamB.user);
