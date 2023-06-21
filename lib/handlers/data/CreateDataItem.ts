import { catcher } from './../../catcher';
import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { findResource } from "./findResource";

const paramsSchema = z.object({
  slug: z.string(),
});

export type CreateDataItemParams = z.input<typeof paramsSchema>;

export function CreateDataItem(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug);

    const id = await catcher(resource.create(req.body));

    if (id instanceof Error) {
      throw new ApiError("Internal Server Error (500)", id.message);
    }

    return {
      version: "1",
      result: {
        id
      },
    } as const;
  });
}

export type CreateDataItemResponse = GetResponse<ReturnType<typeof CreateDataItem>>;
