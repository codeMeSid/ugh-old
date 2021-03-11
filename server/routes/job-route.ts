import { Request, Response, Router } from "express";
import { tournamentEnd } from "../utils/timer-event/end";
import { TimerChannel } from "../utils/enum/timer-channel";
import { TimerType } from "../utils/enum/timer-type";
import { EventData } from "../utils/interface/event-data";
import { tournamentStart } from "../utils/timer-event/start";
import { bracketCheck } from "../utils/timer-event/bracket-check";
import { bracketRankUpdate } from "../utils/timer-event/rank-update";
import { bracketScoreUpdateA } from "../utils/timer-event/score-update-A";
import { bracketScoreUpdateB } from "../utils/timer-event/score-update-B";
import axios from "axios";
import { TIMER_URL } from "../utils/env-check";

const router = Router();
router.get("/test", async (req: Request, res: Response) => {
  const response = await axios.get(`${TIMER_URL}/test`);
  res.send(response.data);
});
router.post("/", async (req: Request, res: Response) => {
  const {
    data: { data },
  } = req.body;
  const { channel, eventName, type }: EventData = data;
  if (channel === TimerChannel.Tournament) {
    switch (type) {
      case TimerType.Start:
        tournamentStart(eventName.id);
        break;
      case TimerType.End:
        tournamentEnd(eventName.id);
        break;
      default:
        break;
    }
  } else if (channel === TimerChannel.Bracket) {
    switch (type) {
      case TimerType.Check:
        bracketCheck(eventName.regId, eventName.tournamentRegId);
        break;
      case TimerType.Rank:
        bracketRankUpdate(eventName.bracketId, eventName.tournamentId);
        break;
      case TimerType.ScoreA:
        bracketScoreUpdateA(eventName.bracketRegId, eventName.tournamentId);
        break;
      case TimerType.ScoreB:
        bracketScoreUpdateB(eventName.bracketRegId, eventName.tournamentId);
        break;
      default:
        break;
    }
  }
  res.send(true);
});

export { router as jobRouter };
