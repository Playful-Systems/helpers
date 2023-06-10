import { z } from "zod";
import type { FormConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { getUrl } from "../../getUrl";
import { ApiError, JsonHandler, type GetResponse } from "next-json-api";

const paramsSchema = z.object({
  slug: z.string(),
});

export type SubmitFormParams = z.input<typeof paramsSchema>;

export function SubmitForm(app: AppConfig, config: FormConfig) {
  return JsonHandler(async (req, res) => {

    const params = parseParams(getUrl(req), paramsSchema);

    if (params instanceof Error) {
      throw new ApiError("Bad Request (400)", params.message);
    }

    const selectedForm = config.items.find((form) => form.slug === params.slug);

    if (!selectedForm) {
      throw new ApiError("Not Found (404)", "Form not found");
    }

    const result = await selectedForm.onSubmit(req.body)

    return {
      version: "1",
      result,
    } as const;
  });
}

export type SubmitFormResponse = GetResponse<ReturnType<typeof SubmitForm>>;
