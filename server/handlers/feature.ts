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
        MailerTemplate.Activate,
        { href: `${process.env.BASE_URL}/login`, ughId: "Player" },
        "siddhanthbajoria@gmail.com,Touseefb2@live.com",
        "activation mail"
      );
      res.send("works");
    },
    middlewares: [],
  },
];
