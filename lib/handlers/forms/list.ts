import { JsonHandler, type GetResponse } from "next-json-api";
import type { FormConfig } from ".";
import type { AppConfig } from "../../adminHandler";

export function ListForms(app: AppConfig, config: FormConfig) {
  return JsonHandler(async (req, res) => {
    return {
      version: "1",
      result: config.items.map((form) => {
        const { onSubmit, ...rest } = form;

        return rest
      }),
    } as const;
  });
}

export type ListFormsResponse = GetResponse<ReturnType<typeof ListForms>>;
