import { ApiSign, HttpMethod, requireAdminAuth } from "@monsid/ugh";

import { consoleAddController } from "../controllers/console/add";
import { consoleAllController } from "../controllers/console/all";
import { consoleAllActiveController } from "../controllers/console/active";
import { consoleActivityController } from "../controllers/console/activity";

export const consoleHandler: Array<ApiSign> = [
  {
    url: "/all",
    method: HttpMethod.Get,
    controller: consoleAllController,
    middlewares: [requireAdminAuth],
  },
  {
    url: "/all/active",
    method: HttpMethod.Get,
    controller: consoleAllActiveController,
    middlewares: [],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: consoleAddController,
    middlewares: [requireAdminAuth],
  },
  {
    url: "/activity/:consoleId",
    method: HttpMethod.Put,
    controller: consoleActivityController,
    middlewares: [requireAdminAuth],
  },
];
