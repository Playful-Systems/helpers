import { z } from "zod";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";
import { Id } from "./Id";
import { catcher } from "../../catcher";
import { findResource } from "./findResource";
import { paginateResults } from "../../paginateResults";

const filters = z.array(
  z.union([
    z.object({
      type: z.literal("text"),
      value: z.string(),
      query: z.string()
    }),
    z.object({
      type: z.literal("number"),
      value: z.string(),
      query: z.number(),
      direction: z.union([z.literal("above"), z.literal("below"), z.literal("equal")])
    }),
    z.object({
      type: z.literal("date"),
      value: z.string(),
      query: z.date(),
      direction: z.union([z.literal("before"), z.literal("after"), z.literal("equal")])
    }),
    z.object({
      type: z.literal("boolean"),
      value: z.string(),
      query: z.boolean()
    }),
    z.object({
      type: z.literal("resource"),
      value: z.string(),
      query: Id
    })
  ])
).default([])

type Filters = z.input<typeof filters>;

const paramsSchema = z.object({
  slug: z.string(),
  amount: z.string().default("20").transform((v) => Number(v)),
  cursor: Id.optional(),
  direction: z.union([z.literal("forwards"), z.literal("backwards")]).default("forwards"),
  filters: z.string().transform((value) => {
    console.log({ value, json: JSON.parse(value) })
    const x = filters.parse(JSON.parse(value))
    console.log({ x })
    return x
  })
})

export type GetTableDataParams = Omit<z.input<typeof paramsSchema>, "filters"> & { filters?: Filters };

export function GetTableData(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    console.log(getUrl(req))

    const params = parseParams(getUrl(req), paramsSchema);

    console.log({ params })

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    console.log(params)

    const resource = findResource(config, params.slug);

    const items = await catcher(resource.list(
      params.amount,
      params.cursor,
      params.direction,
      params.filters
    ))

    if (items instanceof Error) {
      throw new ApiError("Internal Server Error (500)", items.message)
    }

    const { viewableResults: result, cursor } = paginateResults(
      items,
      params.direction,
      params.cursor,
      resource.cursor as never, // chill ts
      params.amount
    )

    return {
      version: "1",
      result,
      cursor
    } as const;
  });
}

export type GetTableDataResponse = GetResponse<ReturnType<typeof GetTableData>>;
