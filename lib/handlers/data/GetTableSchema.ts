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

export type GetTableSchemaParams = z.input<typeof paramsSchema>;

export function GetTableSchema(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug);

    const { columns } = resource

    const fields = columns.map((column) => {

      if (column.header === undefined) {
        return undefined
      }

      const { input, ...rest } = column

      if (rest.type === "resource" || rest.type === "resource-array") {
        // removing 'resource' from the input
        // the frontend doesn't need to know about it
        const { resource, subFields, ...field } = rest
        return field
      }

      return rest
    }).filter((field) => field !== undefined)

    type Field = NonNullable<typeof fields[number]>

    return {
      version: "1",
      result: fields as Field[],
    } as const;
  });
}

export type GetTableSchemaResponse = GetResponse<ReturnType<typeof GetTableSchema>>;
