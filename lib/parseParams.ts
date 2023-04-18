import { z } from "zod";

type EmptyObject = z.AnyZodObject;

export function parseParams<Schema extends EmptyObject>(url: URL, schema: Schema): z.infer<Schema> {
  const unValidatedParams: Record<string, string> = {};

  for (const [key, value] of url.searchParams) {
    unValidatedParams[key] = value;
  }

  return schema.parse(unValidatedParams);
}
