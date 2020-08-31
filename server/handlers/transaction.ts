import { ApiSign, HttpMethod, currentUser, requireAuth } from "@monsid/ugh";
import { transactionCreateController } from "../controllers/transaction/create";
import { transactionVerifyController } from "../controllers/transaction/verify";
import { transactionFetchAllController } from "../controllers/transaction/fetch-all";

export const transactionHandler: Array<ApiSign> = [
  {
    url: "/fetch/all",
    method: HttpMethod.Get,
    controller: transactionFetchAllController,
    middlewares: [],
  },
  {
    url: "/create",
    method: HttpMethod.Post,
    controller: transactionCreateController,
    middlewares: [currentUser, requireAuth],
  },
  {
    url: "/verfiy/:coinId",
    method: HttpMethod.Post,
    controller: transactionVerifyController,
    middlewares: [currentUser, requireAuth],
  },
  // create withdraw request
  // update withdraw request
];
