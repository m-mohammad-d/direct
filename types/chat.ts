import { User } from "./user";

export type Chat = {
  id: string;
  name: string;
  avatar?: string;
  users: User[];
  description?: string;
};
