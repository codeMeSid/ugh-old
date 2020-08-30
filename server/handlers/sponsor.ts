import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
} from "@monsid/ugh";
import { sponsorAddController } from "../controllers/sponsor/add";
import { sponsorFetchActiveController } from "../controllers/sponsor/fetch-active";
import { sponsorFetchController } from "../controllers/sponsor/fetch";
import { sponsorUpdateActivityController } from "../controllers/sponsor/update-activity";

export const sponsorHandler: Array<ApiSign> = [
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: sponsorAddController,
    middlewares: [],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: sponsorFetchActiveController,
    middlewares: [],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: sponsorFetchController,
    middlewares: [],
  },
  // update activity
  {
    url: "/update/activity/:sponsorId",
    method: HttpMethod.Put,
    controller: sponsorUpdateActivityController,
    middlewares: [],
  },
  // update request
  // {
  //   url: "/update/request/:sponsorId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAdminAuth],
  // },
  // // update sponsor form
  // {
  //   url: "/update/form/:sponsorId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [],
  // },
];
