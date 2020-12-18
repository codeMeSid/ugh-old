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
import { userFetchUghIdController } from "../controllers/user/fetch-ughId";
import { userFetchMobileController } from "../controllers/user/fetch-detail-mobile";
import { userSocialActivateController } from "../controllers/user/social-active";
import { userUpdateTournamentController } from "../controllers/user/update-tournament";

export const userHandlers: Array<ApiSign> = [
  {
    url: "/fetch/profile",
    method: HttpMethod.Get,
    controller: userProfileContoller,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/fetch/players/ughId",
    method: HttpMethod.Get,
    controller: userFetchUghIdController,
    middlewares: [],
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
    url: "/fetch/detail/:ughId",
    method: HttpMethod.Get,
    controller: userFetchMobileController,
    middlewares: [],
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
  {
    url: "/social-auth/activate/:ughId",
    method: HttpMethod.Post,
    controller: userSocialActivateController,
    middlewares: [],
  },
  {
    url: "/recovery",
    method: HttpMethod.Post,
    controller: userRecoveryController,
    middlewares: [],
  },
  {
    url: "/signin",
    method: HttpMethod.Post,
    controller: signinController,
    middlewares: [signinValidator, validateRequest],
  },
  {
    url: "/update/tournament",
    method: HttpMethod.Put,
    controller: userUpdateTournamentController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/setting",
    method: HttpMethod.Put,
    controller: userUpdateSettingController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/reset/:recoverykey",
    method: HttpMethod.Put,
    controller: resetUserController,
    middlewares: [],
  },
  {
    url: "/update/profile",
    method: HttpMethod.Put,
    controller: updateUserController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/update/profile/:ughId",
    method: HttpMethod.Put,
    controller: updateUserProfileController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/activate/:ughId",
    method: HttpMethod.Put,
    controller: activeUserController,
    middlewares: [],
  },
  {
    url: "/activity/:userId",
    method: HttpMethod.Put,
    controller: userActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
