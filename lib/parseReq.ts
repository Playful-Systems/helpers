import type { IncomingHttpHeaders } from "http"
import { z } from "zod";

type EmptyObject = z.ZodObject<any, any, any>
type Req = {
  url?: string;
  headers: IncomingHttpHeaders;
  body: unknown;
}

export const parseReq = <ParamsSchema extends EmptyObject, BodySchema extends EmptyObject>(req: Req, schemas: { params?: ParamsSchema, body?: BodySchema }): { url: URL, params: z.infer<ParamsSchema>, body: z.infer<BodySchema> } => {
  if (!req.url) {
    throw new Error("No url found");
  }

  const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

  console.log(req, url)

  const params = parseParams(url, schemas.params);
  const body = parseBody(req.body, schemas.body);

  return { url, params, body };
}

function parseParams<ParamsSchema extends EmptyObject>(url: URL, schema?: ParamsSchema) {
  if (schema) {
    const unValidatedParams: Record<string, string> = {};

    for (const [key, value] of url.searchParams) {
      unValidatedParams[key] = value;
    }

    return schema.parse(unValidatedParams);
  } else {
    return {};
  }
}

function parseBody<BodySchema extends EmptyObject>(body: unknown, schema?: BodySchema) {
  if (schema) {
    return schema.parse(body);
  } else {
    return {};
  }
}