import { ApiSign, HttpMethod } from "@monsid/ugh";
import { Request, Response } from "express";
import { mailer } from "../utils/mailer";
import { MailerTemplate } from "../utils/mailer-template";

export const featureHandlers: Array<ApiSign> = [
  // agenda,
  // email
  {
    url: "/mail",
    method: HttpMethod.Get,
    controller: async (req: Request, res: Response) => {
      await mailer.send(
        MailerTemplate.Welcome,
        { username: "poplu" },
        "siddhanthbajoria@gmail.com",
        "sadasd"
      );
      res.send("works");
    },
    middlewares: [],
  },
  // payment
  // refund
];
