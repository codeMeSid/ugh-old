import SocketIo, { Server as IoServer, Socket } from "socket.io";
import { Server } from "http";
import { SocketEvent } from "../enum/socket-event";
import { SocketMessage } from "../interface/socket-message";
import { SocketChannel } from "../enum/socket-channel";
import { Conversation, ConversationDoc } from "../../models/message";
import { User, UserDoc } from "../../models/user";
import { UserActivity, UserRole } from "@monsid/ugh-og";
import { Tournament } from "../../models/tournament";

class Messenger {
  io: IoServer;
  socket: Socket;
  init(server: Server) {
    this.io = SocketIo(server);
    this.io.on("connection", (socket) => {
      this.socket = socket;
      this.socket.join(["admin", "match", "user", "bracket-rank", "notification"]);
      this.socket.on(SocketEvent.EventSend, (data) => {
        socket.to(data.channel).emit(SocketEvent.EventRecieve, data);
        this.saveMessage(data);
      });
      this.socket.on(SocketEvent.EventUpdate, (data) => {
        this.io.to(data.channel).emit(SocketEvent.EventRecieve, data);
      });
    });
  }

  async saveMessage(data: SocketMessage) {
    const { channel, createdAt, from, text, to } = data;
    let convo: ConversationDoc;
    let users: Array<UserDoc>;
    let user: UserDoc;
    switch (channel) {
      case SocketChannel.Admin:
        if (from === "admin") {
          convo = await Conversation.findOne({
            users: { $in: [to] },
            channel,
          });
          user = await User.findOne({ ughId: to });
        }
        else {
          convo = await Conversation.findOne({
            users: { $in: [from] },
            channel,
          });
          users = await User.find({ role: UserRole.Admin, activity: UserActivity.Active })
        }
        break;
      case SocketChannel.Match:
        convo = await Conversation.findOne({
          channel: `${channel}-${to}`,
        });
        if (convo) {
          const tournament = await Tournament.findOne({ regId: to }).populate("players", "ughId fcmToken", "Users");
          if (tournament)
            users = tournament.players;
        }
        break;
      case SocketChannel.User:
        convo = await Conversation.findOne({
          $and: [{ users: { $in: [to] } }, { users: { $in: [from] } }, { channel }],
        });
        user = await User.findOne({ ughId: to });
        break;
    }
    if (convo) {
      convo.messages.push({ ughId: from, text, createdAt });
    } else {
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
            channel: `${channel}-${to}`,
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
    }
    await convo.save();
    if (user) messenger.io.to(SocketChannel.Notification).emit(SocketEvent.EventRecieve, {
      from: from,
      to: user.fcmToken,
      body: `New Message from ${from}`,
      channel: SocketChannel.Notification
    });
    if (users)
      users.forEach(u => {
        if (u.ughId !== from) {
          messenger.io.to(SocketChannel.Notification).emit(SocketEvent.EventRecieve, {
            from: from,
            to: u.fcmToken,
            body: `New Message from ${from}`,
            channel: SocketChannel.Notification
          });
        }
      })

    return;
  }
}

export const messenger = new Messenger();
