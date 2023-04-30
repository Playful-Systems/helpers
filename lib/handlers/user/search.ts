import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { z } from "zod";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";
import { getUrl } from "../../getUrl";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  query: z
    .string()
    .min(1)
    .max(100)
    .transform((query) => decodeURIComponent(query)),
});

export type SearchUsersParams = z.input<typeof paramsSchema>;

export function SearchUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return JsonHandler(async (req, res) => {
    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const result = await catcher(config.searchUsers(params.query));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to search users through admin api");
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type SearchUsersResponse = GetResponse<ReturnType<typeof SearchUsers>>;
