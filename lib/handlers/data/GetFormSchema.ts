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

export type GetFormSchemaParams = z.input<typeof paramsSchema>;

export function GetFormSchema(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const resource = findResource(config, params.slug);

    const fields = resource.columns
      .map((column) => ({ ...column, id: crypto.randomUUID() }))
      .map((column) => {

        if (column.input === undefined) {
          return undefined
        }

        const { header, ...rest } = column

        return rest
      }).filter((field) => field !== undefined)

    type Field = NonNullable<typeof fields[number]>

    const form = {
      ...resource.form,
      layout: resource.form.layout.map((field) => {
        if ("type" in field) {
          return {
            ...field,
            id: crypto.randomUUID(),
            fields: field.fields.map((field) => {
              return { ...field, id: crypto.randomUUID() }
            })
          }
        }
        return { ...field, id: crypto.randomUUID() }
      })
    }

    return {
      version: "1",
      result: {
        form,
        fields: fields as Field[],
      },
    } as const;
  });
}

export type GetFormSchemaResponse = GetResponse<ReturnType<typeof GetFormSchema>>;
