import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh-og"
import { streamAddController } from "../controllers/stream/add";
import { streamFetchActiveController } from "../controllers/stream/fetch-active";
import { streamFetchAllController } from "../controllers/stream/fetch-all";
import { streamUpdateActivityController } from "../controllers/stream/update-activity";
import { streamAddValidator } from "../utils/validator/stream/add";

export const streamHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: streamAddController,
    middlewares: [
      streamAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: streamFetchAllController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: streamFetchActiveController,
    middlewares: [],
  },
  {
    url: "/update/activity/:streamId",
    method: HttpMethod.Put,
    controller: streamUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
