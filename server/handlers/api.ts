import { ApiSign, requireAdminAuth, currentUser } from "@monsid/ugh-og"

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
import { passbookHandler } from "./passbook";
import { fire } from "../utils/firebase";
import Axios from "axios";
import e from "express";

export const apiHandlers: Array<ApiSign> = [
  {
    url: "/test",
    controller: async (req: any, res: any) => {
      // const resp = await fire.sendNotification("", "hello", "/");
      let data: any, errors: any;
      try {
        const resp = await Axios
          .post("https://fcm.googleapis.com/fcm/send", {
            to: "eKqwUcXtET73zjFHUXSMmD:APA91bG3jAJdi5DDVciZNvDfHkJ9oQVjpAWY88Nn33h5odm6AyWDM5kJnH_I3KEMMcp-QejrcMLtnUCnsJa-eDESqX_TUbGnGWcXZ260HF_RsMH_qSWJx9JQhnJlCwFvBXXurpm0Tc5V",
            notification: {
              title: "UltimateGamersHub Notification",
              body: "hello",
              click_action: `https://ultimategamershub.com/`,
              icon: "https://firebasestorage.googleapis.com/v0/b/ultimategamershub.appspot.com/o/ugh%2Flogo%20(1).png?alt=media&token=17fd9c6b-cb71-4466-83ab-1825493c5b0a",
            },
          });
        data = resp.data
      } catch (error) {
        errors = error;
      }
      res.send({ data, errors });
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
  ...Array.from(passbookHandler).map(
    ({ url, controller, middlewares, method }): ApiSign => {
      return {
        url: `/passbook${url}`,
        controller,
        method,
        middlewares: [...middlewares],
      };
    }
  ),
];
