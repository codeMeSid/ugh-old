import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
} from "@monsid/ugh";
import { tournamentAddController } from "../controllers/tournament/add";
import { tournamentFetchAllController } from "../controllers/tournament/fetch-all";
import { tournamentFetchDetailController } from "../controllers/tournament/fetch-detail";
import { tournamentFetchAllMyController } from "../controllers/tournament/fetch-all-my";
import { tournamentFetchAllActiveController } from "../controllers/tournament/fetch-active";
import { tournamentUpdateStatusController } from "../controllers/tournament/update-status";
import { tournamentJoinController } from "../controllers/tournament/join";

export const tournamentHandler: Array<ApiSign> = [
  {
    url: "/fetch/all/active",
    method: HttpMethod.Get,
    controller: tournamentFetchAllActiveController,
    middlewares: [],
  },
  {
    url: "/fetch/all/my",
    method: HttpMethod.Get,
    controller: tournamentFetchAllMyController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: tournamentFetchAllController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/detail/:tournamentId",
    method: HttpMethod.Get,
    controller: tournamentFetchDetailController,
    middlewares: [],
  },
  {
    url: "/join/:tournamentId",
    method: HttpMethod.Get,
    controller: tournamentJoinController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: tournamentAddController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/update/status/:tournamentId",
    method: HttpMethod.Put,
    controller: tournamentUpdateStatusController,
    middlewares: [currentUser, requireAdminAuth],
  },
  // {
  //   url: "/update/:tournamentId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAuth],
  // },
  // {
  //   url: "/update/join/:tournamentId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAuth],
  // },
  // {
  //   url: "/update/score/:tournamentId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [],
  // },
  // {
  //   url: "/update/dispute/raise/:tournamentId/:bracketId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAuth],
  // },
  // {
  //   url: "/update/dispute/resolve/:tournamentId/:bracketId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAdminAuth],
  // },
  // {
  //   url: "/update/cancel/:tournamentId",
  //   method: HttpMethod.Put,
  //   controller: null,
  //   middlewares: [currentUser, requireAdminAuth],
  // },
];
