import {
  ApiSign,
  currentUser,
  HttpMethod,
  requireAdminAuth,
  requireAuth,
} from "@monsid/ugh-og"
import { bracketFetchDisputes } from "../controllers/bracket/fetch-all-disputes";
import { fetchBracketController } from "../controllers/bracket/fetch-bracket";
import { bracketFetchDisputeDetail } from "../controllers/bracket/fetch-dispute-detail";
import { raiseDisputeController } from "../controllers/bracket/rank/raise-dispute";
import { acceptProofController } from "../controllers/bracket/rank/accept-proof";
import { addProofController } from "../controllers/bracket/rank/add-proof";
import { addRankController } from "../controllers/bracket/rank/add-rank";
import { raiseScoreDisputeController } from "../controllers/bracket/score/raise-dispute";
import { addScoreController } from "../controllers/bracket/score/add-score";
import { addScoreProofController } from "../controllers/bracket/score/add-proof";
import { acceptScoreController } from "../controllers/bracket/score/accept-proof";

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
    controller: raiseDisputeController,
    middlewares: [currentUser, requireAuth],
  },

  {
    url: "/rank/add/:bracketId",
    method: HttpMethod.Post,
    controller: addRankController,
    middlewares: [currentUser, requireAuth],
  },

  {
    url: "/rank/dispute/proof/:bracketId",
    method: HttpMethod.Post,
    controller: addProofController,
    middlewares: [currentUser, requireAuth],
  },

  {
    url: "/rank/dispute/accept/:bracketId",
    method: HttpMethod.Post,
    controller: acceptProofController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/score/add/:bracketId",
    method: HttpMethod.Post,
    controller: addScoreController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/score/dispute/proof/:bracketId",
    method: HttpMethod.Post,
    controller: addScoreProofController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/score/dispute/accept/:bracketId",
    method: HttpMethod.Post,
    controller: acceptScoreController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/score/dispute/:bracketId",
    method: HttpMethod.Post,
    controller: raiseScoreDisputeController,
    middlewares: [currentUser, requireAuth],
  },
];
