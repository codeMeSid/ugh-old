import { infolog, successlog } from "@monsid/ugh";
import SocketIo, { Server as IoServer, Socket } from "socket.io";
import { Server } from "http";
import { SocketEvent } from "../enum/socket-event";
import { SocketMessage } from "../interface/socket-message";
import { SocketChannel } from "../enum/socket-channel";
import { Conversation, ConversationDoc } from "../../models/message";

class Messenger {
  io: IoServer;
  socket: Socket;
  init(server: Server) {
    this.io = SocketIo(server);
    this.io.on("connect", (socket) => {
      successlog("Socket has joined");
      this.socket = socket;
      this.socket.join(["admin", "match", "user"]);
      this.socket.on(SocketEvent.EventSend, (data) => {
        socket.to(data.channel).emit(SocketEvent.EventRecieve, data);
        this.saveMessage(data);
      });
    });
  }
  async saveMessage(data: SocketMessage) {
    const { channel, createdAt, from, text, to } = data;
    let convo: ConversationDoc;
    switch (channel) {
      case SocketChannel.Admin:
        if (from === "admin")
          convo = await Conversation.findOne({
            users: { $in: [to] },
            channel,
          });
        else
          convo = await Conversation.findOne({
            users: { $in: [from] },
            channel,
          });
        break;
      case SocketChannel.Match:
        convo = await Conversation.findOne({
          channel,
        });
        break;
      case SocketChannel.User:
        convo = await Conversation.findOne({
          users: { $in: [from, to] },
          channel,
        });
        break;
    }
    if (convo) {
      convo.messages.push({ ughId: from, text, createdAt });
      await convo.save();
      return;
    }
    switch (channel) {
      case SocketChannel.Admin:
        if (from === "admin")
          convo = Conversation.build({
            users: [to],
            channel,
            messages: [{ ughId: from, text, createdAt }],
          });
        else
          convo = Conversation.build({
            users: [from],
            channel,
            messages: [{ ughId: from, text, createdAt }],
          });
        break;
      case SocketChannel.Match:
        convo = convo = Conversation.build({
          channel,
          messages: [{ ughId: from, text, createdAt }],
        });
        break;
      case SocketChannel.User:
        convo = convo = Conversation.build({
          users: [from, to],
          channel,
          messages: [{ ughId: from, text, createdAt }],
        });
        break;
    }
    await convo.save();
    return;
  }
}

export const messenger = new Messenger();