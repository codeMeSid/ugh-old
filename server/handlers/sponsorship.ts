import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh-og"
import { sponsorshipAddController } from "../controllers/sponsorship/add";
import { sponsorshipFetchController } from "../controllers/sponsorship/fetch";
import { sponsorshipFetchActiveController } from "../controllers/sponsorship/fetch-active";
import { sponsorshipUpdateActivityController } from "../controllers/sponsorship/update-activity";
import { sponsorshipUpdateController } from "../controllers/sponsorship/update";
import { sponsorshipAddValidator } from "../utils/validator/sponsorship/add";

export const sponsorshipHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: sponsorshipAddController,
    middlewares: [
      sponsorshipAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: sponsorshipFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: sponsorshipFetchActiveController,
    middlewares: [],
  },
  {
    url: "/update/activity/:sponsorshipId",
    method: HttpMethod.Put,
    controller: sponsorshipUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/:sponshorshipId",
    method: HttpMethod.Put,
    controller: sponsorshipUpdateController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
