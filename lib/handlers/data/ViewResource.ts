import { JsonHandler, type GetResponse, ApiError } from "next-json-api";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { findResource } from "./findResource";
import { z } from "zod";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";

const paramsSchema = z.object({
  slug: z.string(),
});

export type ViewResourceParams = z.input<typeof paramsSchema>;

export function ViewResource(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug)

    const { slug, label, cursor, columns } = resource

    const columnData = columns.map((column) => {
      return {
        type: column.type,
        label: column.label,
        value: column.value,
      }
    })

    return {
      version: "1",
      result: {
        slug,
        label,
        cursor,
        columns: columnData
      },
    } as const;
  });
}

export type ViewResourceResponse = GetResponse<ReturnType<typeof ViewResource>>;