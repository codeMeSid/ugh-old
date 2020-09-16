import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh";

import { signupController } from "../controllers/user/signup";
import { signinController } from "../controllers/user/signin";
import { signoutController } from "../controllers/user/signout";
import { currentUserController } from "../controllers/user/current-user";
import { userSocialAuthController } from "../controllers/user/social";
import { updateUserController } from "../controllers/user/update";
import { activeUserController } from "../controllers/user/active";
import { userRecoveryController } from "../controllers/user/recovery";
import { resetUserController } from "../controllers/user/reset";
import { userActivityController } from "../controllers/user/activity";
import { userProfileContoller } from "../controllers/user/profile";
import { userFetchAllController } from "../controllers/user/all";
import { userDetailController } from "../controllers/user/detail";
import { signupValidator } from "../utils/validator/user/signup";
import { signinValidator } from "../utils/validator/user/signin";
import { userUpdateSettingController } from "../controllers/user/update-setting";
import { userFetchDetailController } from "../controllers/user/fetch-detail";
import { updateUserProfileController } from "../controllers/user/update-profile";
import { userFetchProfileContoller } from "../controllers/user/fetch-profile";

export const userHandlers: Array<ApiSign> = [
  // {
  //   url: "/active/:activationkey",
  //   method: HttpMethod.Get,
  //   controller: activeUserController,
  //   middlewares: [],
  // },
  {
    url: "/fetch/profile",
    method: HttpMethod.Get,
    controller: userProfileContoller,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/fetch/profile/:ughId",
    method: HttpMethod.Get,
    controller: userFetchProfileContoller,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: userFetchAllController,
    middlewares: [],
  },
  {
    url: "/fetch/detail",
    method: HttpMethod.Get,
    controller: userFetchDetailController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/signout",
    method: HttpMethod.Get,
    controller: signoutController,
    middlewares: [],
  },
  {
    url: "/current",
    method: HttpMethod.Get,
    controller: currentUserController,
    middlewares: [currentUser],
  },
  {
    url: "/fetch/detail/gen/:userId",
    method: HttpMethod.Get,
    controller: userDetailController,
    middlewares: [currentUser, requireAdminAuth],
  },
  // done
  {
    url: "/signup",
    method: HttpMethod.Post,
    controller: signupController,
    middlewares: [signupValidator, validateRequest],
  },
  {
    url: "/social-auth",
    method: HttpMethod.Post,
    controller: userSocialAuthController,
    middlewares: [],
  },
  // {
  //   url: "/recovery",
  //   method: HttpMethod.Post,
  //   controller: userRecoveryController,
  //   middlewares: [],
  // },
  // done
  {
    url: "/signin",
    method: HttpMethod.Post,
    controller: signinController,
    middlewares: [signinValidator, validateRequest],
  },
  {
    url: "/update/setting",
    method: HttpMethod.Put,
    controller: userUpdateSettingController,
    middlewares: [currentUser, requireAuth],
  },
  // {
  //   url: "/reset/:recoverykey",
  //   method: HttpMethod.Post,
  //   controller: resetUserController,
  //   middlewares: [],
  // },
  {
    url: "/update/profile",
    method: HttpMethod.Put,
    controller: updateUserController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/update/profile/:userId",
    method: HttpMethod.Put,
    controller: updateUserProfileController,
    middlewares: [currentUser, requireAdminAuth],
  },
  // done
  {
    url: "/activity/:userId",
    method: HttpMethod.Put,
    controller: userActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
