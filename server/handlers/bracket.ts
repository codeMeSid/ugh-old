import {
  ApiSign,
  currentUser,
  HttpMethod,
  requireAdminAuth,
  requireAuth,
} from "@monsid/ugh";
import { bracketFetchDisputes } from "../controllers/bracket/fetch-all-disputes";
import { fetchBracketController } from "../controllers/bracket/fetch-bracket";
import { bracketFetchDisputeDetail } from "../controllers/bracket/fetch-dispute-detail";
import { bracketRankDisputeController } from "../controllers/bracket/rank-dispute";
import { bracketAcceptProofController } from "../controllers/bracket/update-accept-rank-proof";
import { bracketRankDisputeProofController } from "../controllers/bracket/update-proof";
import { bracketRankUpdateController } from "../controllers/bracket/update-rank-bracket";

export const bracketHandler: Array<ApiSign> = [
  {
    url: "/fetch/disputes",
    method: HttpMethod.Get,
    controller: bracketFetchDisputes,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/dispute/detail/:bracketId",
    method: HttpMethod.Get,
    controller: bracketFetchDisputeDetail,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch/:tournamentId",
    method: HttpMethod.Get,
    controller: fetchBracketController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/rank/dispute/:bracketId",
    method: HttpMethod.Get,
    controller: bracketRankDisputeController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/rank/add/:bracketId",
    method: HttpMethod.Post,
    controller: bracketRankUpdateController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/rank/dispute/proof/:bracketId",
    method: HttpMethod.Post,
    controller: bracketRankDisputeProofController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/rank/dispute/accept/:bracketId",
    method: HttpMethod.Post,
    controller: bracketAcceptProofController,
    middlewares: [currentUser, requireAuth],
  },
];
