import { Request, Response, Router } from "express";
import { TimerChannel } from "../utils/enum/timer-channel";
import { EventData } from "../utils/interface/event-data";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { data }: { data: EventData } = req.body;
  const { channel, eventName, type } = data;
  console.log(req.body);
  if (channel === TimerChannel.Tournament) {
  } else if (channel === TimerChannel.Bracket) {
  }
  res.send(true);
});

export { router as jobRouter };
