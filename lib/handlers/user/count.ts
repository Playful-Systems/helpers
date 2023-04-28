import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import type { NextApiRequest, NextApiResponse } from "next";

export function CountUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return async function CountUsersHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const count = await config.countUsers();

    const response = {
      version: "1",
      result: {
        count
      }
    } as const

    res.json(response);
    return response;
  }
}

export type CountUsersResponse = Awaited<ReturnType<ReturnType<typeof CountUsers>>>