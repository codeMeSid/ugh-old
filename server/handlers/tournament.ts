import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
} from "@monsid/ugh";
import { tournamentAddController } from "../controllers/tournament/add";
import { tournamentFetchAllController } from "../controllers/tournament/fetch-all";

export const tournamentHandler: Array<ApiSign> = [
  // {
  //   url: "/fetch/active",
  //   method: HttpMethod.Get,
  //   controller: null,
  //   middlewares: [],
  // },
  // {
  //   url: "/fetch/my/all",
  //   method: HttpMethod.Get,
  //   controller: null,
  //   middlewares: [currentUser, requireAuth],
  // },
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: tournamentFetchAllController,
    middlewares: [],
  },
  // {
  //   url: "/fetch/:tournamentId",
  //   method: HttpMethod.Get,
  //   controller: null,
  //   middlewares: [],
  // },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: tournamentAddController,
    middlewares: [currentUser, requireAuth],
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
