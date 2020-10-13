import { infolog, successlog } from "@monsid/ugh";
import SocketIo, { Server as IoServer, Socket } from "socket.io";
import { Server } from "http";
import { SocketEvent } from "../enum/socket-event";

class Messenger {
  io: IoServer;
  socket: Socket;
  init(server: Server) {
    this.io = SocketIo(server);
    this.io.on("connect", (socket) => {
      successlog("Socket has joined");
      this.socket = socket;
      this.socket.join(["admin","match","user"])
      this.socket.on(SocketEvent.EventSend, (data) => {
        socket.to(data.channel).emit(SocketEvent.EventRecieve, data);
      });
    });
  }
}

export const messenger = new Messenger();
