import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh-og"
import { sponsorAddController } from "../controllers/sponsor/add";
import { sponsorFetchActiveController } from "../controllers/sponsor/fetch-active";
import { sponsorFetchController } from "../controllers/sponsor/fetch";
import { sponsorUpdateActivityController } from "../controllers/sponsor/update-activity";
import { sponsorAddValidator } from "../utils/validator/sponsor/add";
import { sponsorFetchDetailController } from "../controllers/sponsor/fetch-detail";
import { sponsorProcessController } from "../controllers/sponsor/update-request";
import { sponsorFetchNewController } from "../controllers/sponsor/fetch-new";
import { sponsorUpdateDetailController } from "../controllers/sponsor/update-detail";
import { sponsorUpdateValidator } from "../utils/validator/sponsor/update";

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
    url: "/fetch/:sponsorId",
    method: HttpMethod.Get,
    controller: sponsorFetchNewController,
    middlewares: [],
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
  {
    url: "/update/detail/:sponsorId",
    method: HttpMethod.Put,
    controller: sponsorUpdateDetailController,
    middlewares: [sponsorUpdateValidator, validateRequest],
  },
];
