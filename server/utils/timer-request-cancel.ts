import axios from "axios";
import { TimerType } from "./enum/timer-type";
import { TIMER_URL } from "./env-check";

export const timerCancelRequest = (name: string) => {
  try {
    axios.post(TIMER_URL, {
      name,
      data: {
        type: TimerType.Cancel,
      },
    });
  } catch (error) {
    console.log(`${name} failed to set timer`);
  }
};
