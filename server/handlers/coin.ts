import {
  ApiSign,
  HttpMethod,
  requireAdminAuth,
  currentUser,
  validateRequest,
} from "@monsid/ugh-og"

import { coinFetchController } from "../controllers/coin/fetch";
import { coinFetchActiveController } from "../controllers/coin/fetch-active";
import { coinAddController } from "../controllers/coin/add";
import { coinUpdateActivityController } from "../controllers/coin/activity";
import { coinUpdateController } from "../controllers/coin/update";
import { coinAddValidator } from "../utils/validator/coin/add";

export const coinHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: coinFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: coinFetchActiveController,
    middlewares: [],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: coinAddController,
    middlewares: [
      coinAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/update/activity/:coinId",
    method: HttpMethod.Put,
    controller: coinUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
