import { z } from "zod";

type EmptyObject = z.AnyZodObject;

export function parseParams<Schema extends EmptyObject>(url: URL, schema: Schema): z.infer<Schema> | Error {
  const unValidatedParams: Record<string, string> = {};

  for (const [key, value] of url.searchParams) {
    unValidatedParams[key] = value;
  }

  try {
    return schema.parse(unValidatedParams);
  } catch (error) {
    console.error(error)
    return new Error("the params in the url did not pass validation")
  }
}
