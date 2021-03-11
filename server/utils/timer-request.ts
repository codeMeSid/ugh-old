import axios from "axios";
import { TIMER_URL } from "./env-check";
import { EventData } from "./interface/event-data";

export const timerRequest = (
  name: string,
  time: string | Date,
  data: EventData
) => {
  try {
    axios.post(TIMER_URL, { data, name, time });
  } catch (error) {
    console.log({ msg: "TIMER REQUEST", error: `${name} failed to set timer` });
  }
};
