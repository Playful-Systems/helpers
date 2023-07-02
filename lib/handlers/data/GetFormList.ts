import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { findResource } from "./findResource";

const paramsSchema = z.object({
  slug: z.string(),
  resource: z.string(),
  query: z.string().default("")
});

export type GetFormListParams = z.input<typeof paramsSchema>;

export function GetFormList(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug);

    const column = resource.columns.find((column) => column.value === params.resource);

    if (!column) {
      throw new ApiError("Bad Request (400)", `Resource ${params.resource} not found`);
    }

    if (column.type !== "resource" && column.type !== "resource-array") {
      throw new ApiError("Bad Request (400)", `Resource ${params.resource} is not a resource`);
    }

    const result = await column.resource.search(params.query);

    return {
      version: "1",
      result: result,
    } as const;
  });
}

export type GetFormListResponse = GetResponse<ReturnType<typeof GetFormList>>;
