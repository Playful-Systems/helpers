import { JsonHandler, type GetResponse } from "next-json-api";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";

export function TableDetails<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  const columns = config.columns.map(({ schema, ...column }) => column);

  return JsonHandler(async () => {
    return {
      version: "1",
      result: {
        columns,
        userIdKey: config.cursor,
      },
    } as const;
  });
}

export type TableDetailsResponse = GetResponse<ReturnType<typeof TableDetails>>;
