import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { z } from "zod";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";
import { getUrl } from "../../getUrl";
import { parseParams } from "../../parseParams";
import { userId } from "./UserId";
import { createUserParser } from "./createUserParser";

const paramsSchema = z.object({
  userId,
});

export type UpdateUserParams = z.input<typeof paramsSchema>;

export function UpdateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  const bodyParser = createUserParser(config.columns);

  return JsonHandler(async (req, res) => {
    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const body = await catcher(bodyParser(req.body));

    if (body instanceof Error) {
      throw new ApiError("Bad Request (400)", "Failed to parse and validate the body");
    }

    const result = await catcher(config.updateUser(params.userId, body));

    if (result instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to update user through admin api");
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type UpdateUserResponse = GetResponse<ReturnType<typeof UpdateUser>>;
