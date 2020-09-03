import {
  ApiSign,
  HttpMethod,
  requireAdminAuth,
  currentUser,
  validateRequest,
} from "@monsid/ugh";
import { galleryFetchController } from "../controllers/gallery/fetch";
import { galleryFetchActiveController } from "../controllers/gallery/fetch-active";
import { galleryAddController } from "../controllers/gallery/add";
import { galleryUpdateActivityController } from "../controllers/gallery/update-activity";
import { galleryAddValidator } from "../utils/validator/gallery/add";

export const galleryHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: galleryFetchController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/active",
    method: HttpMethod.Get,
    controller: galleryFetchActiveController,
    middlewares: [],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: galleryAddController,
    middlewares: [
      galleryAddValidator,
      validateRequest,
      currentUser,
      requireAdminAuth,
    ],
  },
  {
    url: "/update/activity/:galleryId",
    method: HttpMethod.Put,
    controller: galleryUpdateActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
