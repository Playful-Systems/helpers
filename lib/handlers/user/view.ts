import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { userId } from "./UserId";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { catcher } from "../../catcher";

const paramsSchema = z.object({
  userId,
});

export type ViewUserParams = z.input<typeof paramsSchema>;

export function ViewUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return JsonHandler(async (req, res) => {
    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const result = await catcher(config.viewUser(params.userId));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to fetch user through admin api");
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type ViewUserResponse = Awaited<ReturnType<ReturnType<typeof ViewUser>>>;
