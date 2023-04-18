import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  cursor: z.string().optional().transform((userId) => Number(userId ?? 1)),
  amount: z.string().optional().transform((amount) => Number(amount ?? 20)),
  direction: z.union([z.literal("forwards"), z.literal("backwards")]).optional().default("forwards")
})

export type ListUsersParams = z.input<typeof paramsSchema>;

function processResults<UserItem extends object>(
  result: UserItem[],
  direction: 'forwards' | 'backwards',
  cursor: number,
  cursorKey: keyof UserItem,
  amount: number,
) {
  const hasExtraResult = result.length > amount;

  if (direction === 'forwards') {
    const viewableResults = result.slice(0, amount);
    const nextCursor = hasExtraResult ? result[amount]?.[cursorKey] ?? null : null;
    const newCursor = {
      back: cursor === 1 ? null : cursor,
      next: nextCursor,
    };
    return { viewableResults, cursor: newCursor };
  } else {
    const prevCursor = hasExtraResult ? result[amount - 1]?.[cursorKey] ?? null : null;
    const nextCursor = result.length > 0 ? result[0]?.[cursorKey] ?? null : null;
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
    } as const

    res.json(response);
    return response;
  }
}

export type ListUsersResponse = Awaited<ReturnType<ReturnType<typeof ListUsers>>>