import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh";
import { newsAddController } from "../controllers/news/add";
import { newsFetchController } from "../controllers/news/fetch-all";
import { newsFetchActiveController } from "../controllers/news/fetch-active";
import { newsUpdateActiveController } from "../controllers/news/update-active";
import { newsAddValidator } from "../utils/validator/news/add";

export const newsHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: newsAddController,
    middlewares: [
      newsAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
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
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/activity/:newsId",
    method: HttpMethod.Put,
    controller: newsUpdateActiveController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
