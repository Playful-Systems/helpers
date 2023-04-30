import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import type { NextApiRequest, NextApiResponse } from "next";

export function TableDetails<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const columns = config.columns.map(({ schema, ...column }) => column);

  return async function TableDetailsHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const response = {
      version: "1",
      result: {
        columns,
        userIdKey: config.cursor,
      },
    } as const

    res.json(response);
    return undefined as unknown as typeof response;
  }
}

export type TableDetailsResponse = Awaited<ReturnType<ReturnType<typeof TableDetails>>>