import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { catcher } from "../../catcher";

export function CountUsers<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return JsonHandler(async () => {
    const count = await catcher(config.countUsers());

    if (count instanceof Error) {
      throw new ApiError("Bad Gateway (502)", "Failed to fetch count of users from admin api");
    }

    return {
      version: "1",
      result: {
        count,
      },
    } as const;
  });
}

export type CountUsersResponse = GetResponse<ReturnType<typeof CountUsers>>;
