import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
} from "@monsid/ugh";
import { gameAddController } from "../controllers/game/add";
import { gameFetchController } from "../controllers/game/fetch";
import { gameFetchActiveController } from "../controllers/game/fetch-active";
import { gameUpdateActivityController } from "../controllers/game/activity";
import { gameUpdateController } from "../controllers/game/update";

export const gameHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: gameAddController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: gameFetchController,
    middlewares: [],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: gameFetchActiveController,
    middlewares: [],
  },
  {
    url: "/update/activity/:gameId",
    method: HttpMethod.Put,
    controller: gameUpdateActivityController,
    middlewares: [],
  },
  {
    url: "/update/:gameId",
    method: HttpMethod.Put,
    controller: gameUpdateController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
