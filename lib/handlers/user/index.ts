import type Router from "find-my-way";
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
  updateUser: (userId: UserId, data: Partial<Item>) => Promise<void>;
  deleteUser: (userId: UserId) => Promise<void>;
  createUser: (data: Item) => Promise<UserId>;
}

export const registerUserHandlers = <Item extends object>(
  app: Router.Instance<Router.HTTPVersion.V1>, 
  config: AppConfig, 
  feature: UsersConfig<Item>
) => {

  app.on("GET", "/users/list", ListUsers(config, feature));
  app.on("POST", "/users/create", CreateUser(config, feature));

}