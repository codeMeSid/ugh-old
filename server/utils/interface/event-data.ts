import { TimerChannel } from "../enum/timer-channel";
import { TimerType } from "../enum/timer-type";

export interface EventData {
  channel: TimerChannel;
  type: TimerType;
  eventName: string;
}
