import type { AppConfig } from "../../adminHandler";
import type { z } from 'zod';

import { ListForms } from "./list";
import { ViewForm } from "./view";
import { SubmitForm } from "./submit";

export type FormConfig = {
  forms: Array<{
    slug: string;
    onSubmit: (data: unknown) => Promise<unknown>;
  }>
}

export const registerFormHandlers = (
  config: AppConfig,
  feature: FormConfig
) => {

  return {
    "/forms/list": ListForms(config, feature),
    "/forms/view": ViewForm(config, feature),
    "/forms/submit": SubmitForm(config, feature),
  }

}