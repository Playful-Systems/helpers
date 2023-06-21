import { JsonHandler, type GetResponse } from "next-json-api";
import type { DataBrowserConfig } from ".";
import type { AppConfig } from "../../adminHandler";

export function ListResources(app: AppConfig, config: DataBrowserConfig) {
  return JsonHandler(async (req, res) => {

    const resources = config.resources.map((resource) => {
      return {
        slug: resource.slug,
        label: resource.label,
      }
    })

    return {
      version: "1",
      result: resources,
    } as const;
  });
}

export type ListResourcesResponse = GetResponse<ReturnType<typeof ListResources>>;
