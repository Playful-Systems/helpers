import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { z } from "zod";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";
import { getUrl } from "../../getUrl";
import { parseParams } from "../../parseParams";
import { userId } from "./UserId";

const paramsSchema = z.object({
  userId,
});

export type DeleteUserParams = z.input<typeof paramsSchema>;

export function DeleteUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return JsonHandler(async (req, res) => {
    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const result = await catcher(config.deleteUser(params.userId));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to delete user through admin api");
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type DeleteUserResponse = GetResponse<ReturnType<typeof DeleteUser>>;
