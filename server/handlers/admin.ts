import { ApiSign, HttpMethod } from "@monsid/ugh";
import { adminFetchMetricController } from "../controllers/admin/fetch-metrics";

export const adminHandler: Array<ApiSign> = [
  {
    url: "/fetch/metrics",
    method: HttpMethod.Get,
    controller: adminFetchMetricController,
    middlewares: [],
  },
];