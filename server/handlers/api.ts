import { ApiSign, currentUser, requireAuth } from "@monsid/ugh";

import { userHandlers } from "./user";
import { featureHandlers } from "./feature";
import { consoleHandler } from "./console";
import { gameHandler } from "./game";
import { coinHandler } from "./coin";

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
        middlewares: [currentUser, requireAuth, ...middlewares],
      };
    }
  ),
  ...Array.from(gameHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/game${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(coinHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/coin${url}`,
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
