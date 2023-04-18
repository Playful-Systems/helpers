import type { AppConfig } from "../../adminHandler";
import type { z } from 'zod';

import { ListUsers } from "./list";
import { ViewUser } from "./view";
import { SearchUsers } from "./search";
import { UpdateUser } from "./update";
import { DeleteUser } from "./delete";
import { CreateUser } from "./create";

type UserId = number;
type ColumnType = "string" | "number" | "date" | "boolean" | "img"
export type Column<Item extends object, name extends keyof Item = keyof Item, schema extends z.ZodType = z.ZodType> = {
  name: name;
  label: string;
  type: ColumnType;
  schema: schema;
}

export type UsersConfig<Item extends object> = {
  columns: Array<Column<Item>>;
  cursor: keyof Item;
  listUsers: (amount: number, cursor: UserId, direction: "backwards" | "forwards") => Promise<Array<Item>>;
  viewUser: (userId: UserId) => Promise<Item>;
  searchUsers: (query: string) => Promise<Array<Item>>;
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
    "/users/view": ViewUser(config, feature),
    "/users/search": SearchUsers(config, feature),
    "/users/update": UpdateUser(config, feature),
    "/users/delete": DeleteUser(config, feature),
    "/users/create": CreateUser(config, feature)
  }

}