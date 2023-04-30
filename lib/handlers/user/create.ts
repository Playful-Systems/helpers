import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";
import { createUserParser } from "./createUserParser";

export type CreateUserParams = {};

export function CreateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  const bodyParser = createUserParser(config.columns);

  return JsonHandler(async (req) => {
    const body = await catcher(bodyParser(req.body));

    if (body instanceof Error) {
      throw new ApiError("Bad Request (400)", "Failed to parse and validate the body");
    }

    const result = await catcher(config.createUser(body));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to create user in admin api");
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type CreateUserResponse = GetResponse<ReturnType<typeof CreateUser>>;
