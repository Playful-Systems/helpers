import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  query: z.string().min(1).max(100),
})

export type SearchUsersParams = z.input<typeof paramsSchema>;

export function SearchUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return async function SearchUsersHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const params = parseParams(url, paramsSchema);

    const result = await config.searchUsers(params.query);

    const response = {
      version: "1",
      result,
    } as const

    res.json(response);
    return response;
  }
}

export type SearchUsersResponse = Awaited<ReturnType<ReturnType<typeof SearchUsers>>>