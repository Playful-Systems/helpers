import type { ConduitInstance, ConduitResponse } from "@playful-systems/conduit";

import type { GeneratedRoutes } from "./adminHandler";
import type { UserObject } from "./handlers/user/createUserParser";

import type { ListUsersParams, ListUsersResponse } from "./handlers/user/list";
import type { ViewUserParams, ViewUserResponse } from "./handlers/user/view";
import type { SearchUsersParams, SearchUsersResponse } from "./handlers/user/search";
import type { UpdateUserParams, UpdateUserResponse } from "./handlers/user/update";
import type { DeleteUserParams, DeleteUserResponse } from "./handlers/user/delete";
import type { CreateUserParams, CreateUserResponse } from "./handlers/user/create";
import type { CountUsersResponse } from "./handlers/user/count";
import type { TableDetailsResponse } from "./handlers/user/table";

import type { ListFormsResponse } from "./handlers/forms/list";
import type { ViewFormParams, ViewFormResponse } from "./handlers/forms/view";
import type { SubmitFormParams, SubmitFormResponse } from "./handlers/forms/submit";
import type { GetListParams, GetListResponse } from "./handlers/forms/getList"

import type { CountDataItemsParams, CountDataItemsResponse } from "./handlers/data/CountDataItems";
import type { CreateDataItemParams, CreateDataItemResponse } from "./handlers/data/CreateDataItem";
import type { DeleteDataItemParams, DeleteDataItemResponse } from "./handlers/data/DeleteDataItem";
import type { GetFormListParams, GetFormListResponse } from "./handlers/data/GetFormList";
import type { GetFormSchemaParams, GetFormSchemaResponse } from "./handlers/data/GetFormSchema";
import type { GetTableDataParams, GetTableDataResponse } from "./handlers/data/GetTableData";
import type { GetTableSchemaParams, GetTableSchemaResponse } from "./handlers/data/GetTableSchema";
import type { ListResourcesResponse } from "./handlers/data/ListResources";
import type { SearchTableDataParams, SearchTableDataResponse } from "./handlers/data/SearchTableData";
import type { UpdateDataItemParams, UpdateDataItemResponse } from "./handlers/data/UpdateDataItem";
import type { ViewDataItemParams, ViewDataItemResponse } from "./handlers/data/ViewDataItem";

export const buildApi = (conduit: ConduitInstance) =>
  ({
    "/hello": () => conduit.get("/hello"),

    "/users/list": (params: ListUsersParams) => conduit.get<ListUsersResponse>("/users/list", { params }),
    "/users/view": (params: ViewUserParams) => conduit.get<ViewUserResponse>("/users/view", { params }),
    "/users/search": (params: SearchUsersParams) => conduit.get<SearchUsersResponse>("/users/search", { params }),
    "/users/update": (params: UpdateUserParams, body: UserObject) =>
      conduit.patch<UpdateUserResponse>("/users/update", body, { params }),
    "/users/delete": (params: DeleteUserParams) => conduit.delete<DeleteUserResponse>("/users/delete", { params }),
    "/users/create": (params: CreateUserParams, body: UserObject) =>
      conduit.post<CreateUserResponse>("/users/create", body, { params }),
    "/users/count": () => conduit.get<CountUsersResponse>("/users/count"),
    "/users/table": () => conduit.get<TableDetailsResponse>("/users/table"),

    "/forms/list": () => conduit.get<ListFormsResponse>("/forms/list"),
    "/forms/view": (params: ViewFormParams) => conduit.get<ViewFormResponse>("/forms/view", { params }),
    "/forms/submit": (params: SubmitFormParams, body: object) =>
      conduit.post<SubmitFormResponse>("/forms/submit", body, { params }),
    "/forms/getList": (params: GetListParams) => conduit.get<GetListResponse>("/forms/getList", { params }),

    "/data/count": (params: CountDataItemsParams) => conduit.get<CountDataItemsResponse>("/data/count", { params }),
    "/data/create": (params: CreateDataItemParams, body: object) =>
      conduit.post<CreateDataItemResponse>("/data/create", body, { params }),
    "/data/delete": (params: DeleteDataItemParams) => conduit.delete<DeleteDataItemResponse>("/data/delete", { params }),
    "/data/form/list": (params: GetListParams) => conduit.get<GetListResponse>("/data/form/list", { params }),
    "/data/form/schema": (params: GetFormSchemaParams) =>
      conduit.get<GetFormSchemaResponse>("/data/form/schema", { params }),
    "/data/table/data": (params: GetTableDataParams) =>
      conduit.get<GetTableDataResponse>("/data/table/data", { params: { ...params, filters: JSON.stringify(params.filters) } }),
    "/data/table/schema": (params: GetTableSchemaParams) =>
      conduit.get<GetTableSchemaResponse>("/data/table/schema", { params }),
    "/data/list": () => conduit.get<ListResourcesResponse>("/data/list"),
    "/data/table/search": (params: SearchTableDataParams) =>
      conduit.get<SearchTableDataResponse>("/data/table/search", { params }),
    "/data/update": (params: UpdateDataItemParams, body: object) =>
      conduit.patch<UpdateDataItemResponse>("/data/update", body, { params }),
    "/data/view": (params: ViewDataItemParams) => conduit.get<ViewDataItemResponse>("/data/view", { params }),

    // rome-ignore lint/suspicious/noExplicitAny: when used in satisfies its fine
  }) satisfies Record<keyof GeneratedRoutes, (params: any, body: any) => Promise<ConduitResponse<any>>>;
