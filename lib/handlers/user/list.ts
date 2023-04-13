import type { IncomingMessage, ServerResponse } from "http"
import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import { parseReq } from "../../parseReq";
import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";

const schemas = {
  params: z.object({
    cursor: z.string().optional().transform((userId) => Number(userId ?? 1)),
    amount: z.string().optional().transform((amount) => Number(amount ?? 20)),
    direction: z.union([z.literal("forwards"), z.literal("backwards")]).optional().default("forwards")
  }),
}

export function ListUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const columns = config.columns.map(({ schema, ...column }) => column);

  return async function ListUsersHandler(req: NextApiRequest, res: NextApiResponse) {

    const { params } = parseReq(req, schemas);

    const result = await config.listUsers(params.amount, params.cursor, params.direction);

    const response = {
      version: "1",
      result: result,
      table: {
        columns
      },
      cursor: {
        back: params.cursor ? result[0][config.cursor] : null,
        next: result.length === params.amount ? result[result.length - 1][config.cursor] : null
      },
      params
    }

    res.write(JSON.stringify(response));
    res.end();

    return response;
  }
}

export type UsersListResponse = Awaited<ReturnType<ReturnType<typeof ListUsers>>>