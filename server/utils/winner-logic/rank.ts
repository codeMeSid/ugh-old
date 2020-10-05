import { BracketDoc } from "../../models/bracket";
import { TournamentDoc } from "../../models/tournament";
import { UserDoc } from "../../models/user";

export const rankLogger = (
  tournament: TournamentDoc,
  brackets: BracketDoc[],
  users: UserDoc[]
) => {};

// console.log(message);
// try {
//   const tournament = await Tournament.findOne({
//     regId: tournamentId,
//   })
//     .populate("game", "gameType", "Games")
//     .session(session);
//   if (!tournament) return;
//   if (tournament.winners.length > 0) return;

//   let brackets = await Bracket.find({
//     _id: { $in: tournament.brackets },
//   }).session(session);
//   if (brackets.length === 0) return;
//   switch (tournament.game.gameType) {
//     case GameType.Rank:
//       const isTournamentOver =
//         new Date(tournament.endDateTime).valueOf() < Date.now();
//       if (isTournamentEnd || isTournamentOver)
//         brackets = brackets.map((bracket) => {
//           if (bracket.teamA.score === 0) bracket.winner = "DQ-SNU";
//           return bracket;
//         });

//       const bracketsWithWinner = brackets.filter(({ winner }) => winner);
//       if (bracketsWithWinner.length !== brackets.length) {
//         console.log("Winner not evaluated");
//         return;
//       }
//       const winnerList = brackets
//         .filter(({ winner }) => winner !== "DQ-SNU" && winner !== "DQ-WD")
//         .sort((bA, bB) => bA.teamA.score - bB.teamA.score)
//         .slice(0, tournament.winnerCount);
//       const users = await User.find({
//         _id: { $in: winnerList.map((winner) => winner.teamA.user) },
//       });
//       tournament.winners = users.map((user) => user.ughId);
//       const winnerPrize = prizeDistribution(
//         tournament.winnerCoin,
//         tournament.winners.length
//       );
//       users.map(async (user, index) => {
//         user.wallet.coins += winnerPrize[index];
//         await user.save({ session });
//       });
//       break;
//     case GameType.Score:
//       break;
//   }
//   brackets.map(async (bracket) => {
//     await bracket.save({ session });
//   });
//   await tournament.save({ session });
//   await session.commitTransaction();
// } catch (error) {
//   console.log({ message: error.message });
//   await session.abortTransaction();
// }
// session.endSession();
