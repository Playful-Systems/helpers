import type { AppConfig } from "../../adminHandler";

import { ListResources } from "./ListResources";
import { GetTableSchema } from "./GetTableSchema";
import { GetTableData } from "./GetTableData";
import { SearchTableData } from "./SearchTableData";
import { GetFormSchema } from "./GetFormSchema";
import { GetFormList } from "./GetFormList";
import { CreateDataItem } from "./CreateDataItem";
import { UpdateDataItem } from "./UpdateDataItem";
import { DeleteDataItem } from "./DeleteDataItem";
import { ViewDataItem } from "./ViewDataItem";
import { CountDataItems } from "./CountDataItems";
import { ViewResource } from "./ViewResource";
import { Id } from "./Id";

type BaseHeader = {
  label: string;
  order: number;
}

type BaseInput = {
  label: string;
  description: string;
}

type IdColumnDef = {
  type: "id"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder?: string;
    minimumLength?: number;
    maximumLength?: number;
    suffix?: string;
    prefix?: string;
  }
}

type TextColumnDef = {
  type: "text"
  value: string;
  header?: BaseHeader & {
    prefix?: string;
  }
  input?: BaseInput & {
    placeholder?: string;
    minimumLength?: number;
    maximumLength?: number;
    suffix?: string;
    prefix?: string;
  }
}

type ImageColumnDef = {
  type: "image"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    maximumWidth?: number;
    maximumHeight?: number;
    maximumSizeBytes?: number;
  }
}

type DateColumnDef = {
  type: "date"
  value: string;
  header?: BaseHeader & {
    format: string
  };
  input?: BaseInput & {
    minimumDate?: Date;
    maximumDate?: Date;
  }
}

type ResourceColumnDef = {
  type: "resource"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type TextArrayColumnDef = {
  type: "text-array"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type NumberColumnDef = {
  type: "number"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    minimum?: number;
    maximum?: number;
    suffix?: string;
    prefix?: string;
  }
}

type BooleanColumnDef = {
  type: "boolean"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type TimeColumnDef = {
  type: "time"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type ImageArrayColumnDef = {
  type: "image-array"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type VideoColumnDef = {
  type: "video"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type ContentColumnDef = {
  type: "content"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type ContentArrayColumnDef = {
  type: "content-array"
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

type ColumnDef =
  | IdColumnDef
  | TextColumnDef
  | ImageColumnDef
  | DateColumnDef
  | ResourceColumnDef
  | TextArrayColumnDef
  | NumberColumnDef
  | BooleanColumnDef
  | TimeColumnDef
  | ImageArrayColumnDef
  | VideoColumnDef
  | ContentColumnDef
  | ContentArrayColumnDef

type Form = {
  title: string
  layout: ({
    value: string;
  } | {
    type: "section"
    fields: {
      value: string;
    }[]
  })[];
}

type Item = object;

type SearchFilters = ({
  type: "text"
  value: string;
  query: string;
} | {
  type: "number"
  value: string;
  query: number;
  direction: "above" | "below" | "equal";
} | {
  type: "date"
  value: string;
  query: Date;
  direction: "before" | "after" | "equal";
} | {
  type: "boolean"
  value: string;
  query: boolean;
} | {
  type: "resource"
  value: string;
  query: Id;
})[]

export type DataBrowserResource = {
  slug: string;
  label: string;
  columns: ColumnDef[];
  cursor: string;
  form: Form;
  list: (amount: number, cursor: Id, direction: "backwards" | "forwards", filters: SearchFilters) => Promise<Array<Item>>;
  view: (id: Id) => Promise<Item>;
  search: (query: string) => Promise<Array<Item>>;
  update: (id: Id, data: Item) => Promise<Id>;
  delete: (id: Id) => Promise<Id>;
  create: (data: Item) => Promise<Id>;
  count: () => Promise<number>;
}

export type DataBrowserConfig = {
  resources: Array<DataBrowserResource>
}

export const registerDataHandlers = (
  config: AppConfig,
  feature: DataBrowserConfig
) => ({
  "/data/resources/list": ListResources(config, feature),
  "/data/resources/view": ViewResource(config, feature),
  "/data/table/schema": GetTableSchema(config, feature),
  "/data/table/data": GetTableData(config, feature),
  "/data/table/search": SearchTableData(config, feature),
  "/data/form/schema": GetFormSchema(config, feature),
  "/data/form/list": GetFormList(config, feature),
  "/data/create": CreateDataItem(config, feature),
  "/data/update": UpdateDataItem(config, feature),
  "/data/delete": DeleteDataItem(config, feature),
  "/data/view": ViewDataItem(config, feature),
  "/data/count": CountDataItems(config, feature),
})