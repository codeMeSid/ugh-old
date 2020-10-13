export interface SocketMessage {
  to: string;
  from: string;
  text: string;
  channel: string;
  createdAt: number;
}
