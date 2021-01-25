import { BadRequestError, TournamentStatus } from "@monsid/ugh-og";
import { format, startOfWeek } from "date-fns";
import { Request, Response } from "express";
import { Tournament } from "../../models/tournament";

export const generateTournamentReportController = async (
  req: Request,
  res: Response
) => {
  const tournamentData: Array<any> = [];
  const tournaments = await Tournament.find({
    startDateTime: { $lt: new Date(startOfWeek(new Date())) },
    status: TournamentStatus.Completed,
  })
    .populate("players", "ughId id", "Users")
    .populate("dqPlayers", "ughId id", "Users")
    .populate("game", "name gameType console", "Games");
  if (!tournaments) throw new BadRequestError("Invalid tournament Operation");
  if (tournaments && tournaments.length === 0)
    throw new BadRequestError("No Tournaments to generate report");
  tournaments.forEach((t) => {
    tournamentData.push([
      "Name",
      "Reg Id",
      "Game",
      "Game Type",
      "Start",
      "End",
      "Entry Coins",
      "Req. Players",
      "Players Joined",
      "Group",
      "Winner Count",
      "Free?",
      "Added By",
    ]);
    tournamentData.push([
      t.name,
      t.regId,
      t?.game?.name,
      t?.game?.gameType,
      format(new Date(t.startDateTime), "dd/MM/yyyy hh:mm a"),
      format(new Date(t.endDateTime), "dd/MM/yyyy hh:mm a"),
      t.coins,
      t.playerCount,
      t.players.length * t.group.participants,
      `${t?.group?.name} ${t?.group?.participants}`,
      t.winnerCount,
      t.isFree ? "Yes" : "No",
      `${t?.addedBy?.name} (${t?.addedBy?.role})`,
    ]);
    tournamentData.push(["Players", "Team Mates"]);
    t.players.forEach((p) =>
      tournamentData.push([
        p.ughId,
        ...(t?.teamMates
          ? t?.teamMates[p.id]?.map((k: any) => `${k?.name} (${k?.email})`) ||
            []
          : []),
      ])
    );
    tournamentData.push(["Winners", "Position", "Prize"]);
    t.winners.forEach((w) =>
      tournamentData.push([w.ughId, w.position, w.coins])
    );
    tournamentData.push([]);
  });

  res.send(tournamentData);
};
