import { BracketDoc } from "../../../../../models/bracket";
import { TournamentDoc } from "../../../../../models/tournament";

export const canCreateBracketCheck = (
  brackets: Array<BracketDoc>,
  tournament: TournamentDoc
) => tournament.players.length - 1 > brackets.length;
