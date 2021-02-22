import { UserDoc } from "../../../../../models/user";

export const getUserIndex = (users: Array<UserDoc>, userId: any) =>
  users.findIndex((u) => JSON.stringify(u.id) === JSON.stringify(userId));

export const getUserUghIndex = (users: Array<UserDoc>, ughId: string) =>
  users.findIndex((u) => u?.ughId === ughId);
