import { ApiSign } from "@monsid/ugh";

import { userHandlers } from "./user";
import { featureHandlers } from "./feature";
import { consoleHandler } from "./console";

export const apiHandlers: Array<ApiSign> = [
  {
    url: "/test",
    controller: (req: any, res: any) => res.send("HI"),
    middlewares: [],
  },
  ...Array.from(userHandlers).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/user${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(consoleHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/console${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(featureHandlers).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/feature${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
];
