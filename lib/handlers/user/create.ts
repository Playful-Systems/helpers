import type { NextApiRequest, NextApiResponse } from "next";
import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import { createUserParser } from "./createUserParser";

export type CreateUserParams = {};

export function CreateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const bodyParser = createUserParser(config.columns);

  return async function CreateUsersHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const body = await bodyParser(req.body);
    const result = await config.createUser(body);

    const response = {
      version: "1",
      result,
    } as const

    res.json(response);
    return response;
  }
}

export type CreateUserResponse = Awaited<ReturnType<ReturnType<typeof CreateUser>>>