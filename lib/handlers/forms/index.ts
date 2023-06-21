import type { AppConfig } from "../../adminHandler";

import { ListForms } from "./list";
import { ViewForm } from "./view";
import { SubmitForm } from "./submit";
import { GetList } from "./getList"

export type FormConfig = {
  items: Array<{
    slug: string;
    onSubmit: (data: unknown) => Promise<unknown>;
    lists?: {
      [key: string]: (query: string) => Promise<Array<unknown>>;
    }
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
    "/forms/getList": GetList(config, feature)
  }

}