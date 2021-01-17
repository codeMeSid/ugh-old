import {
  ApiSign,
  BadRequestError,
  currentUser,
  HttpMethod,
  TournamentStatus,
  TransactionTypes,
} from "@monsid/ugh-og";
import { Console } from "../models/console";
import { Request, Response } from "express";
import { adminFetchMetricController } from "../controllers/admin/fetch-metrics";
import { requireSuperAdminAuth } from "../utils/middlewares/require-superadmin";
import { User } from "../models/user";
import { Coin } from "../models/coin";
import { Tournament } from "../models/tournament";
import { Transaction } from "../models/transaction";
import { Sponsorship } from "../models/sponsorship";
import { Stream } from "../models/stream";
import { Sponsor } from "../models/sponsor";
import { Bracket } from "../models/bracket";
import mongoose from "mongoose";
import { News } from "../models/news";
import { Gallery } from "../models/gallery";

const superAdminMiddleware = [currentUser, requireSuperAdminAuth];

export const adminHandler: Array<ApiSign> = [
  {
    url: "/fetch/metrics",
    method: HttpMethod.Get,
    controller: adminFetchMetricController,
    middlewares: [],
  },
  // user (tournament history add and delete) edit
  // game edit
  // console edit
  // streams edit
  // sponsorships edit
  {
    url: "/delete/console/:consoleId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { consoleId } = req.params;
      await Console.findByIdAndDelete(consoleId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/user/:userId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { userId } = req.params;
      const user = await User.findById(userId);
      if (!user) throw new BadRequestError("Invalid User");
      const tournaments = await Tournament.find({
        $or: [{ players: { $in: [user] } }, { dqPlayers: { $in: [user] } }],
        status: { $in: [TournamentStatus.Upcoming, TournamentStatus.Started] },
      });
      if (tournaments.length >= 1)
        throw new BadRequestError(
          "User is currently in tournament, cannot be deleted"
        );
      await user.deleteOne();
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/coin/:coinId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { coinId } = req.params;
      await Coin.findByIdAndDelete(coinId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/tournament/:tournamentId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { tournamentId } = req.params;
      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const tournament = await Tournament.findById(tournamentId).session(
          session
        );
        if (!tournament) throw new BadRequestError("Invalid Tournament");
        if (tournament.status !== TournamentStatus.Completed)
          throw new BadRequestError(
            "Tournament cannot be deleted at this moment"
          );
        const brackets = await Bracket.find({
          _id: { $in: tournament.brackets },
        });
        await Promise.all([
          Tournament.findByIdAndDelete(tournamentId).session(session),
          brackets.map(async (bracket) =>
            Bracket.findByIdAndDelete(bracket.id).session(session)
          ),
        ]);
        await session.commitTransaction();
      } catch (error) {
        await session.abortTransaction();
        console.log({ error });
        throw new BadRequestError(error.message);
      }
      session.endSession();
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/dispute/:bracketId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { bracketId } = req.params;
      const bracket = await Bracket.findById(bracketId);
      if (!bracket.winner) throw new BadRequestError("Dispute unresolved");
      bracket.teamA.hasRaisedDispute = false;
      bracket.teamB.hasRaisedDispute = false;
      await bracket.save();
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/sponsorship/:sponsorshipId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { sponsorshipId } = req.params;
      await Sponsorship.findByIdAndDelete(sponsorshipId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/transaction/:transactionId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { transactionId } = req.params;
      const transaction = await Transaction.findById(transactionId);
      if (transaction.status === TransactionTypes.Requested)
        throw new BadRequestError("Unproccessed Transaction");
      await transaction.deleteOne();
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/stream/:streamId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { streamId } = req.params;
      await Stream.findByIdAndDelete(streamId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/sponsor/:sponsorId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { sponsorId } = req.params;
      await Sponsor.findByIdAndDelete(sponsorId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/news/:newsId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { newsId } = req.params;
      await News.findByIdAndDelete(newsId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
  {
    url: "/delete/gallery/:galleryId",
    method: HttpMethod.Delete,
    controller: async (req: Request, res: Response) => {
      const { galleryId } = req.params;
      await Gallery.findByIdAndDelete(galleryId);
      res.send(true);
    },
    middlewares: superAdminMiddleware,
  },
];
