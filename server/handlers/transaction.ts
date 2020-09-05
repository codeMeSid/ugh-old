import {
  ApiSign,
  HttpMethod,
  currentUser,
  requireAuth,
  requireAdminAuth,
} from "@monsid/ugh";

import { transactionCreateController } from "../controllers/transaction/create";
import { transactionVerifyController } from "../controllers/transaction/verify";
import { transactionFetchAllController } from "../controllers/transaction/fetch-all";
import { transactionFetchController } from "../controllers/transaction/fetch";
import { transactionCreateRequestController } from "../controllers/transaction/create-request";

export const transactionHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: transactionFetchAllController,
    middlewares: [currentUser, requireAdminAuth],
  },
  {
    url: "/fetch",
    method: HttpMethod.Get,
    controller: transactionFetchController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/create",
    method: HttpMethod.Post,
    controller: transactionCreateController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/verify/:coinId",
    method: HttpMethod.Post,
    controller: transactionVerifyController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/create/request",
    controller: transactionCreateRequestController,
    method: HttpMethod.Get,
    middlewares: [currentUser, requireAuth],
  },
  // create withdraw request
  // update withdraw request
];
