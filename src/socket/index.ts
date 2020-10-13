import SocketIo from "socket.io-client";
import { SocketChannel } from "../../server/utils/enum/socket-channel";
import { SocketEvent } from "../../server/utils/enum/socket-event";
import { SocketMessage } from "../../server/utils/interface/socket-message";
const socket = SocketIo.connect();

export const event = {
  joinChannel: (name: SocketChannel) =>
    socket.emit(SocketEvent.EventJoin, name),
  sendMessage: (data: SocketMessage) =>
    socket.emit(SocketEvent.EventSend, data),
  recieveMessage: (ufnc: (data: SocketMessage) => any) =>
    socket.on(SocketEvent.EventRecieve, (data: SocketMessage) => {
      ufnc(data);
    }),
};
