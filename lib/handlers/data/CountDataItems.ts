import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { catcher } from "../../catcher";
import { findResource } from "./findResource";

const paramsSchema = z.object({
  slug: z.string(),
});

export type CountDataItemsParams = z.input<typeof paramsSchema>;

export function CountDataItems(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug);

    const count = await catcher(resource.count())

    if (count instanceof Error) {
      throw new ApiError("Internal Server Error (500)", count.message);
    }

    return {
      version: "1",
      result: {
        count
      },
    } as const;
  });
}

export type CountDataItemsResponse = GetResponse<ReturnType<typeof CountDataItems>>;
