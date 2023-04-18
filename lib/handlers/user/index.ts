import type { z } from "zod";
import type { AppConfig } from "../../adminHandler";

import { ListUsers } from "./list";
import { CreateUser } from "./create";

type UserId = number;

export type UsersConfig<Item extends object> = {
  columns: Array<{
    name: keyof Item;
    label: string;
    type: "string" | "number" | "date" | "boolean";
    schema: z.ZodType;
  }>;
  cursor: keyof Item;
  listUsers: (amount: number, cursor: UserId, direction: "backwards" | "forwards") => Promise<Array<Item>>;
  viewUser: (userId: UserId) => Promise<Item>;
  searchUsers: (query: string, key: keyof Item) => Promise<Array<Item>>;
  updateUser: (userId: UserId, data: Partial<Item>) => Promise<void>;
  deleteUser: (userId: UserId) => Promise<void>;
  createUser: (data: Item) => Promise<UserId>;
}

export const registerUserHandlers = <Item extends object>(
  config: AppConfig, 
  feature: UsersConfig<Item>
) => {

  return {
    "/users/list": ListUsers(config, feature),
    "/users/create": CreateUser(config, feature)
  }

}