import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { Id } from "./Id";
import { findResource } from "./findResource";
import { catcher } from "../../catcher";

const paramsSchema = z.object({
  slug: z.string(),
  itemId: Id
});

export type ViewDataItemParams = z.input<typeof paramsSchema>;

export function ViewDataItem(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug)

    const result = await catcher(resource.view(params.itemId))

    if (result instanceof Error) {
      throw new ApiError("Internal Server Error (500)", result.message);
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type ViewDataItemResponse = GetResponse<ReturnType<typeof ViewDataItem>>;
