import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
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


export const userHandlers: Array<ApiSign> = [
  {
    url: "/active/:activationkey",
    method: HttpMethod.Get,
    controller: activeUserController,
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
    url: "/signup",
    method: HttpMethod.Post,
    controller: signupController,
    middlewares: [],
  },
  {
    url: "/social-auth",
    method: HttpMethod.Post,
    controller: userSocialAuthController,
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
    middlewares: [],
  },
  {
    url: "/reset/:recoverykey",
    method: HttpMethod.Post,
    controller: resetUserController,
    middlewares: [],
  },
  {
    url: "/update",
    method: HttpMethod.Put,
    controller: updateUserController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/activity/:userId",
    method: HttpMethod.Put,
    controller: userActivityController,
    middlewares: [currentUser, requireAdminAuth],
  },
  // get user details
  // get all users
];
