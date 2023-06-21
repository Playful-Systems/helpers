import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { catcher } from "../../catcher";
import { findResource } from "./findResource";
import { Id } from "./Id";

const paramsSchema = z.object({
  slug: z.string(),
  itemId: Id
});

export type UpdateDataItemParams = z.input<typeof paramsSchema>;

export function UpdateDataItem(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug)

    const result = await catcher(resource.update(params.itemId, req.body))

    if (result instanceof Error) {
      throw new ApiError("Internal Server Error (500)", result.message);
    }

    return {
      version: "1",
      result,
    } as const;
  });
}

export type UpdateDataItemResponse = GetResponse<ReturnType<typeof UpdateDataItem>>;
