import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh-og"
import { gameAddController } from "../controllers/game/add";
import { gameFetchController } from "../controllers/game/fetch";
import { gameFetchActiveController } from "../controllers/game/fetch-active";
import { gameUpdateActivityController } from "../controllers/game/activity";
import { gameUpdateController } from "../controllers/game/update";
import { gameFetchDetailController } from "../controllers/game/fetch-detail";
import { gameAddValidator } from "../utils/validator/game/add";

export const gameHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: gameAddController,
    middlewares: [
      gameAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: gameFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: gameFetchActiveController,
    middlewares: [],
  },
  {
    url: "/fetch/detail/:gameId",
    method: HttpMethod.Get,
    controller: gameFetchDetailController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/activity/:gameId",
    method: HttpMethod.Put,
    controller: gameUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/:gameId",
    method: HttpMethod.Put,
    controller: gameUpdateController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
