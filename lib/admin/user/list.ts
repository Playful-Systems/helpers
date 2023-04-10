import { JsonHandler } from "next-json-api";
import { checkAuthorisationHeader } from "@/checkAuthorisationHeader";

type ListUsersConfig = {
  api_key: string;
  users: () => Promise<Array<Record<string, string>>>;
  columns: Array<{
    name: string;
    label: string;
    type: "string" | "number" | "date" | "boolean";
  }>;
}

export const ListUsers = (config: ListUsersConfig) => {
  return JsonHandler(async (req, res) => {
    checkAuthorisationHeader(req, config.api_key);

    const result = await config.users();

    return {
      version: "1",
      result,
      table: {
        columns: config.columns,
      }
    }
  })
}