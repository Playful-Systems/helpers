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

export type BaseHeader = {
  label?: string; // only needs to be defined to over-write the column label
  order: number;
}

export type BaseInput = {
  label?: string; // only needs to be defined to over-write the column label
  description: string;
  required?: boolean; // defaults to true
}

export type IdColumnDef = {
  type: "id"
  label: string;
  value: string;
  link?: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder?: string;
    minimumLength?: number;
    maximumLength?: number;
    suffix?: string;
    prefix?: string;
  }
}

export type TextColumnDef = {
  type: "text"
  label: string;
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

export type ImageColumnDef = {
  type: "image"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    maximumWidth?: number;
    maximumHeight?: number;
    maximumSizeBytes?: number;
  }
}

export type DateColumnDef = {
  type: "date"
  label: string;
  value: string;
  header?: BaseHeader & {
    format: string
  };
  input?: BaseInput & {
    placeholder: string;
    minimumDate?: Date;
    maximumDate?: Date;
  }
}

export type DateTimeColumnDef = {
  type: "datetime"
  label: string;
  value: string;
  header?: BaseHeader & {
    format: string
  };
  input?: BaseInput & {
    placeholder: string;
    minimumDate?: Date;
    maximumDate?: Date;
  }
}

export type ResourceColumnDef = {
  type: "resource"
  label: string;
  value: string;
  resource: DataBrowserResource,
  idKey: string;
  nameKey: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder: string;
    terms: {
      notFound: string;
      search: string;
    },
  },
  subFields?: ColumnDef[]
}

export type ResourceArrayColumnDef = {
  type: "resource-array"
  label: string;
  value: string;
  resource: DataBrowserResource,
  idKey: string;
  nameKey: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder: string;
    terms: {
      notFound: string;
      search: string;
    },
  },
  subFields?: ColumnDef[]
}

export type TextArrayColumnDef = {
  type: "text-array"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type NumberColumnDef = {
  type: "number"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {
    minimum?: number;
    maximum?: number;
    suffix?: string;
    prefix?: string;
  }
}

export type BooleanColumnDef = {
  type: "boolean"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type TimeColumnDef = {
  type: "time"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type ImageArrayColumnDef = {
  type: "image-array"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type VideoColumnDef = {
  type: "video"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type ContentColumnDef = {
  type: "content"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type ContentArrayColumnDef = {
  type: "content-array"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type MarkdownColumnDef = {
  type: "markdown"
  label: string;
  value: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type DropdownColumnDef = {
  type: "dropdown"
  label: string;
  value: string;
  options: {
    key: string;
    label: string;
  }[];
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder: string;
  }
}

export type DropdownArrayColumnDef = {
  type: "dropdown-array"
  label: string;
  value: string;
  options: {
    key: string;
    label: string;
  }[];
  header?: BaseHeader & {}
  input?: BaseInput & {
    placeholder: string;
  }
}

export type LocationColumnDef = {
  type: "location"
  label: string;
  value: string;
  longitudeKey: string;
  latitudeKey: string;
  header?: BaseHeader & {}
  input?: BaseInput & {}
}

export type ColumnDef =
  | IdColumnDef
  | TextColumnDef
  | ImageColumnDef
  | DateColumnDef
  | DateTimeColumnDef
  | ResourceColumnDef
  | ResourceArrayColumnDef
  | TextArrayColumnDef
  | NumberColumnDef
  | BooleanColumnDef
  | TimeColumnDef
  | ImageArrayColumnDef
  | VideoColumnDef
  | ContentColumnDef
  | ContentArrayColumnDef
  | MarkdownColumnDef
  | DropdownColumnDef
  | DropdownArrayColumnDef
  | LocationColumnDef

export type Form = {
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

export type Item = Record<string, unknown>;

export type SearchFilters = ({
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
  list: (amount: number, cursor: Id | undefined, direction: "backwards" | "forwards", filters: SearchFilters) => Promise<Array<Item>>;
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