import SocketIo from "socket.io-client";
const socket = SocketIo.connect();

export const event = {
  sendMessage: (userId: string, text: string, channel: string) => {},
  recieveMessage: () => {},
};
