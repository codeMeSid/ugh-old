import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  requireAuth,
} from "@monsid/ugh";
import { settingFetchController } from "../controllers/setting/fetch-all";
import { settingUpdateController } from "../controllers/setting/update";
import { settingTypeFetchController } from "../controllers/setting/fetch-wallpaper";
import { settingFetchCoinsController } from "../controllers/setting/fetch-coins";

export const settingHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: settingFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/:type",
    method: HttpMethod.Get,
    controller: settingTypeFetchController,
    middlewares: [],
  },
  {
    url: "/fetch/coins",
    method: HttpMethod.Get,
    controller: settingFetchCoinsController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/update",
    method: HttpMethod.Put,
    controller: settingUpdateController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
