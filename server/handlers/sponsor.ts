import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh";
import { sponsorAddController } from "../controllers/sponsor/add";
import { sponsorFetchActiveController } from "../controllers/sponsor/fetch-active";
import { sponsorFetchController } from "../controllers/sponsor/fetch";
import { sponsorUpdateActivityController } from "../controllers/sponsor/update-activity";
import { sponsorAddValidator } from "../utils/validator/sponsor/add";
import { sponsorFetchDetailController } from "../controllers/sponsor/fetch-detail";
import { sponsorProcessController } from "../controllers/sponsor/update-request";

export const sponsorHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: sponsorAddController,
    middlewares: [sponsorAddValidator, validateRequest],
  },
  // done
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: sponsorFetchActiveController,
    middlewares: [],
  },
  // done
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: sponsorFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/detail/:sponsorId",
    method: HttpMethod.Get,
    controller: sponsorFetchDetailController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/activity/:sponsorId",
    method: HttpMethod.Put,
    controller: sponsorUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/process/:sponsorId",
    method: HttpMethod.Put,
    controller: sponsorProcessController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
