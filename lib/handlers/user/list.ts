import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";
import { getUrl } from "../../getUrl";
import { parseParams } from "../../parseParams";
import { ApiError, type GetResponse, JsonHandler } from "next-json-api";
import { z } from "zod";
import { paginateResults } from "../../paginateResults";

const paramsSchema = z.object({
  cursor: z
    .string()
    .optional()
    .transform((userId) => Number(userId ?? 1)),
  amount: z
    .string()
    .optional()
    .transform((amount) => Number(amount ?? 20)),
  direction: z
    .union([z.literal("forwards"), z.literal("backwards")])
    .optional()
    .default("forwards"),
});

export type ListUsersParams = z.input<typeof paramsSchema>;

export function ListUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return JsonHandler(async (req, res) => {
    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const result = await catcher(config.listUsers(params.amount, params.cursor, params.direction));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to list users through admin api");
    }

    const { viewableResults, cursor } = paginateResults(
      result,
      params.direction,
      params.cursor,
      config.cursor,
      params.amount,
    );

    return {
      version: "1",
      result: viewableResults,
      cursor,
    } as const;
  });
}

export type ListUsersResponse = GetResponse<ReturnType<typeof ListUsers>>;
