import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import { z } from "zod";
import type { NextApiRequest, NextApiResponse } from "next";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  cursor: z.string().optional().transform((userId) => Number(userId ?? 1)),
  amount: z.string().optional().transform((amount) => Number(amount ?? 20)),
  direction: z.union([z.literal("forwards"), z.literal("backwards")]).optional().default("forwards")
})

function processResults<UserItem extends object>(
  result: UserItem[],
  direction: 'forwards' | 'backwards',
  cursor: number,
  cursorKey: keyof UserItem,
  amount: number,
) {
  console.log(result)
  const hasExtraResult = result.length > amount;

  if (direction === 'forwards') {
    const viewableResults = result.slice(0, amount);
    const nextResult = result[amount];
    if (!nextResult) {
      throw new Error('No next result');
    }
    const nextCursor = hasExtraResult ? nextResult[cursorKey] : null;
    const newCursor = {
      back: cursor === 1 ? null : cursor,
      next: nextCursor,
    };
    return { viewableResults, cursor: newCursor };
  } else {
    const nextResult = result[amount];
    if (!nextResult) {
      throw new Error('No next result');
    }
    const prevCursor = hasExtraResult ? nextResult[cursorKey] : null;
    const firstResult = result[0];
    if (!firstResult) {
      throw new Error('No first result');
    }
    const nextCursor = result.length > 0 ? firstResult[cursorKey] : null;
    const newCursor = {
      back: prevCursor,
      next: nextCursor,
    };
    const viewableResults = hasExtraResult ? result.slice(0, amount).reverse() : result.reverse();
    return { viewableResults, cursor: newCursor };
  }
}

export function ListUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const columns = config.columns.map(({ schema, ...column }) => column);

  return async function ListUsersHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const params = parseParams(url, paramsSchema);

    const result = await config.listUsers(params.amount, params.cursor, params.direction);

    const { viewableResults, cursor } = processResults(result, params.direction, params.cursor, config.cursor, params.amount);

    const response = {
      version: "1",
      result: viewableResults,
      table: {
        columns
      },
      cursor,
      params
    }

    res.json(response);
    return response;
  }
}

export type UsersListResponse = Awaited<ReturnType<ReturnType<typeof ListUsers>>>