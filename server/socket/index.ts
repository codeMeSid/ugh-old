import { infolog, successlog } from "@monsid/ugh";
import SocketIo, { Server as IoServer, Socket } from "socket.io";
import { Server } from "http";

class Messenger {
  io: IoServer;
  socket: Socket;
  init(server: Server) {
    this.io = SocketIo(server);
    this.io.on("connect", (socket) => {
      successlog("Socket has joined");
      this.socket = socket;
    });
  }
}

export const messenger = new Messenger();
