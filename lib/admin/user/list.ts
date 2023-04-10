import { JsonHandler } from "next-json-api";
import { checkAuthorisationHeader } from "../../checkAuthorisationHeader";

type ListUsersConfig<Item extends object> = {
  api_key: string;
  users: () => Promise<Array<Item>>;
  columns: Array<{
    name: keyof Item;
    label: string;
    type: "string" | "number" | "date" | "boolean";
  }>;
}

export const ListUsersHandler = <Item extends object>(config: ListUsersConfig<Item>) => {
  return JsonHandler(async (req, res) => {
    checkAuthorisationHeader(req, config.api_key);

    const result = await config.users();

    return {
      version: "1",
      result,
      table: {
        columns: config.columns,
      }
    } as const
  })
}