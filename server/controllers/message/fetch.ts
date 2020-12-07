import { Request, Response } from "express";
import { Conversation } from "../../models/message";
import { SocketChannel } from "../../utils/enum/socket-channel";

export const messageFetchController = async (req: Request, res: Response) => {
  const { from, to, channel } = req.body;
  let filter: any;
  switch (channel) {
    case SocketChannel.Admin:
      if (from === "admin") filter = { users: { $in: [to] }, channel };
      else filter = { users: { $in: [from] }, channel };
      break;
    case SocketChannel.Match:
      filter = { channel: `${channel}-${to}` };
      break;
    case SocketChannel.User:
      filter = {
        $and: [{ users: { $in: [to] } }, { users: { $in: [from] } }],
        channel,
      };
      break;
  }
  const conversation = await Conversation.findOne(filter);

  res.send(conversation);
};
