import {
  ApiSign,
  currentUser,
  HttpMethod,
  requireAdminAuth,
  requireAuth,
} from "@monsid/ugh-og";
import { addCategoryController } from "../controllers/category/add";
import { fetchActiveCategoryController } from "../controllers/category/fetch-active";
import { fetchAllCategoryController } from "../controllers/category/fetch-all";
import { categoryfetchDetailController } from "../controllers/category/fetch-detail";
import { categoryUpdateController } from "../controllers/category/update";
import { updateActivityCategoryController } from "../controllers/category/update-activity";
import { requireSuperAdminAuth } from "../utils/middlewares/require-superadmin";

export const categoryHandler: Array<ApiSign> = [
  {
    url: "/add",
    controller: addCategoryController,
    middlewares: [currentUser, requireAdminAuth],
    method: HttpMethod.Post,
  },
  {
    url: "/fetch/all",
    controller: fetchAllCategoryController,
    middlewares: [currentUser, requireAdminAuth],
    method: HttpMethod.Get,
  },
  {
    url: "/fetch/active",
    controller: fetchActiveCategoryController,
    middlewares: [],
    method: HttpMethod.Get,
  },
  {
    url: "/fetch/:categoryId",
    controller: categoryfetchDetailController,
    middlewares: [currentUser, requireAdminAuth],
    method: HttpMethod.Get,
  },
  {
    url: "/update/activity/:categoryId",
    controller: updateActivityCategoryController,
    middlewares: [currentUser, requireAdminAuth],
    method: HttpMethod.Put,
  },
  {
    url: "/update/:categoryId",
    controller: categoryUpdateController,
    middlewares: [currentUser, requireSuperAdminAuth],
    method: HttpMethod.Put,
  },
  // {
  //   url: "/delete/:categoryId",
  //   controller: null,
  //   middlewares: [currentUser, requireSuperAdminAuth],
  //   method: HttpMethod.Delete,
  // },
];
