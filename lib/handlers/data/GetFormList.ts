import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";

const paramsSchema = z.object({
  slug: z.string(),
});

export type GetFormListParams = z.input<typeof paramsSchema>;

export function GetFormList(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    throw new ApiError("Not Implemented (501)", "This endpoint is not implemented yet.");

    // return {
    //   version: "1",
    //   result: ,
    // } as const;
  });
}

export type GetFormListResponse = GetResponse<ReturnType<typeof GetFormList>>;
