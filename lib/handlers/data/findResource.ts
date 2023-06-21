import type { DataBrowserConfig } from ".";
import { ApiError } from "next-json-api";

export function findResource(config: DataBrowserConfig, slug: string) {
  const resource = config.resources.find(r => r.slug === slug);

  if (!resource) {
    throw new ApiError("Not Found (404)", `Resource ${slug} not found`);
  }

  return resource;
}
