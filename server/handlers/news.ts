import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
} from "@monsid/ugh";
import { newsAddController } from "../controllers/news/add";
import { newsFetchController } from "../controllers/news/fetch-all";
import { newsFetchActiveController } from "../controllers/news/fetch-active";
import { newsUpdateActiveController } from "../controllers/news/update-active";

export const newsHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: newsAddController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: newsFetchActiveController,
    middlewares: [],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: newsFetchController,
    middlewares: [],
  },
  {
    url: "/update/activity/:newsId",
    method: HttpMethod.Put,
    controller: newsUpdateActiveController,
    middlewares: [],
  },
];
