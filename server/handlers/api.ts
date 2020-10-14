import { ApiSign, requireAdminAuth, currentUser } from "@monsid/ugh";

import { userHandlers } from "./user";
import { featureHandlers } from "./feature";
import { consoleHandler } from "./console";
import { gameHandler } from "./game";
import { coinHandler } from "./coin";
import { galleryHandler } from "./gallery";
import { sponsorshipHandler } from "./sponsorship";
import { sponsorHandler } from "./sponsor";
import { streamHandler } from "./stream";
import { newsHandler } from "./news";
import { tournamentHandler } from "./tournament";
import { transactionHandler } from "./transaction";
import { adminHandler } from "./admin";
import { settingHandler } from "./settings";
import { bracketHandler } from "./bracket";
import { messageHandler } from "./message";

export const apiHandlers: Array<ApiSign> = [
  {
    url: "/test",
    controller: (req: any, res: any) => {
      res.send("HI");
    },
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
  ...Array.from(adminHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/admin${url}`,
        controller,
        method,
        middlewares: [currentUser, requireAdminAuth, ...middlewares],
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
  ...Array.from(galleryHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/gallery${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(sponsorHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/sponsor${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(sponsorshipHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/sponsorship${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(streamHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/stream${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(newsHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/news${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(tournamentHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/tournament${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(transactionHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/transaction${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(settingHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/settings${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
  ...Array.from(bracketHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/bracket${url}`,
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
  ...Array.from(messageHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/message${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
];
