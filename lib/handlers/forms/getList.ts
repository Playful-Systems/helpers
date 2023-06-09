import { z } from "zod";
import type { FormConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";

const paramsSchema = z.object({
  slug: z.string(),
  list: z.string(),
  query: z.string()
});

export type GetFormListParams = z.input<typeof paramsSchema>;

export function GetFormList(app: AppConfig, config: FormConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const selectedForm = config.items.find((form) => form.slug === params.slug);

    if (!selectedForm) {
      throw new ApiError("Not Found (404)", "Form not found");
    }

    const { lists } = selectedForm;

    if (!lists) {
      throw new ApiError("Not Found (404)", "Lists not found");
    }

    const list = lists[params.list];

    if (!list) {
      throw new ApiError("Not Found (404)", "List not found");
    }

    const result = await list(params.query);

    return {
      version: "1",
      result,
    } as const;
  });
}

export type GetFormListResponse = GetResponse<ReturnType<typeof GetFormList>>;
