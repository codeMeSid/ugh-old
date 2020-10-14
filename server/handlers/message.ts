import { ApiSign, currentUser, HttpMethod, requireAuth } from "@monsid/ugh";
import { messageFetchController } from "../controllers/message/fetch";

export const messageHandler: Array<ApiSign> = [
  {
    url: "/fetch",
    method: HttpMethod.Post,
    controller: messageFetchController,
    middlewares: [currentUser, requireAuth],
  },
];
