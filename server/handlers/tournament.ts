import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
  validateRequest,
} from "@monsid/ugh-og";
import { tournamentAddController } from "../controllers/tournament/add";
import { tournamentFetchAllController } from "../controllers/tournament/fetch-all";
import { tournamentFetchDetailController } from "../controllers/tournament/fetch-detail";
import { tournamentFetchAllMyController } from "../controllers/tournament/fetch-all-my";
import { tournamentFetchAllActiveController } from "../controllers/tournament/fetch-active";
import { tournamentUpdateStatusController } from "../controllers/tournament/update-status";
import { tournamentJoinController } from "../controllers/tournament/join";
import { tournamentAddValidator } from "../utils/validator/tournament/add";
import { TournamentEvaluateController } from "../controllers/tournament/evaluate";
import { tournamentFetchUghIdController } from "../controllers/tournament/fetch-ughId";
import { tournamentLeaveHandler } from "../controllers/tournament/leave";
import { tournamentDisqualifyController } from "../controllers/tournament/disqualify";
import { generateTournamentReportController } from "../controllers/tournament/generate-report";

export const tournamentHandler: Array<ApiSign> = [
  {
    url: "/generate/report",
    method: HttpMethod.Get,
    controller: generateTournamentReportController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/evaluate/:regId",
    method: HttpMethod.Get,
    controller: TournamentEvaluateController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/user/fetch/:ughId",
    method: HttpMethod.Get,
    controller: tournamentFetchUghIdController,
    middlewares: [currentUser, requireAuth],
  },
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
    middlewares: [currentUser],
  },
  {
    url: "/join/:tournamentId",
    method: HttpMethod.Post,
    controller: tournamentJoinController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/leave/:tournamentId",
    method: HttpMethod.Get,
    controller: tournamentLeaveHandler,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/add",
    method: HttpMethod.Post,
    controller: tournamentAddController,
    middlewares: [
      tournamentAddValidator,
      validateRequest,
      currentUser,
      requireAuth,
    ],
  },
  {
    url: "/disqualify/:tournamentId",
    method: HttpMethod.Put,
    controller: tournamentDisqualifyController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/update/status/:tournamentId",
    method: HttpMethod.Put,
    controller: tournamentUpdateStatusController,
    middlewares: [currentUser, requireAdminAuth],
  },
];
