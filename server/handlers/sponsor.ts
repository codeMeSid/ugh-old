import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAdminAuth,
} from "@monsid/ugh";

export const sponsorHandler: Array<ApiSign> = [
  // add sponsor request
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: null,
    middlewares: [],
  },
  // fetch all active
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: null,
    middlewares: [],
  },
  // fetch all request
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: null,
    middlewares: [currentUser, requireAdminAuth],
  },
  // update activity
  {
    url: "/update/activity/:sponsorId",
    method: HttpMethod.Put,
    controller: null,
    middlewares: [],
  },
  // update request
  {
    url: "/update/request/:sponsorId",
    method: HttpMethod.Put,
    controller: null,
    middlewares: [currentUser, requireAdminAuth],
  },
  // update sponsor form
  {
    url: "/update/form/:sponsorId",
    method: HttpMethod.Put,
    controller: null,
    middlewares: [],
  },
];
