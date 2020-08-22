import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
} from "@monsid/ugh";
import { sponsorAddController } from "../controllers/sponsor/add";
import { sponsorFetchActiveController } from "../controllers/sponsor/fetch-active";
import { sponsorFetchController } from "../controllers/sponsor/fetch";

export const sponsorHandler: Array<ApiSign> = [
  // add sponsor request
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: sponsorAddController,
    middlewares: [],
  },
  // fetch all active
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: sponsorFetchActiveController,
    middlewares: [],
  },
  // fetch all request
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: sponsorFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  // update activity
  {
    url: "/update/activity/:sponsorId",
    method: HttpMethod.Put,
    controller: sponsorFetchActiveController,
    middlewares: [currentUser, requireAdminAuth],
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
