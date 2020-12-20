import {
  ApiSign,
  HttpMethod,
  requireAdminAuth,
  currentUser,
  validateRequest,
} from "@monsid/ugh-og"

import { consoleAddController } from "../controllers/console/add";
import { consoleAllController } from "../controllers/console/all";
import { consoleAllActiveController } from "../controllers/console/active";
import { consoleActivityController } from "../controllers/console/activity";
import { consoleAddValidator } from "../utils/validator/console/add";

export const consoleHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: consoleAllController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: consoleAllActiveController,
    middlewares: [],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: consoleAddController,
    middlewares: [
      consoleAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/update/activity/:consoleId",
    method: HttpMethod.Put,
    controller: consoleActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
