import { Request, Response } from "express";
import { Transaction } from "../../models/transaction";
import { BadRequestError, TransactionTypes, UserActivity, UserRole } from "@monsid/ugh-og"
import { randomBytes } from "crypto";
import { User } from "../../models/user";
import { messenger } from "../../utils/socket";
import { SocketChannel } from "../../utils/enum/socket-channel";
import { SocketEvent } from "../../utils/enum/socket-event";

export const transactionCreateRequestController = async (
  req: Request,
  res: Response
) => {
  const { id } = req.currentUser;
  const { coins, paymentMode, phone } = req.body;
  if (!phone) throw new BadRequestError("mobile no./UPI id required");
  const user = await User.findById(id);
  if (!user) throw new BadRequestError("Request failed");
  if (!user.idProof.panCard || !user.idProof.panUrl)
    throw new BadRequestError("Please update your Pan card details");
  if (!user.idProof.aadharCard || !user.idProof.aadharUrl)
    throw new BadRequestError("Please update your Aadhar card details");
  const userEarnings = user.tournaments
    .filter((t) => t.didWin)
    .reduce((acc, t) => acc + t.coins, 0);
  if (userEarnings < 300)
    throw new BadRequestError(
      "Earn minimum 300 UGH coins in winnings to make withdrawal request"
    );
  const orderId = "ugh" + randomBytes(4).toString("hex").substr(0, 4);
  const transaction = Transaction.build({
    amount: coins,
    status: TransactionTypes.Requested,
    user: id,
    orderId,
    paymentMode,
    phone,
    userDetail: user,
  });
  await transaction.save();
  const admins = await User.find({ role: UserRole.Admin, activity: UserActivity.Active });
  if (admins) admins.forEach(admin => {
    messenger
      .io
      .to(SocketChannel.Notification)
      .emit(SocketEvent.EventRecieve, {
        from: user.ughId,
        to: admin.fcmToken,
        body: "New Withdraw Request",
        action: `/admin/transactions`,
        channel: SocketChannel.Notification
      });
  })
  res.send(true);
};
