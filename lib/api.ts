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
import type { GetFormListParams, GetFormListResponse } from "./handlers/forms/getList"

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
    "/forms/getList": (params: GetFormListParams) => conduit.get<GetFormListResponse>("/forms/getList", { params }),

    // rome-ignore lint/suspicious/noExplicitAny: when used in satisfies its fine
  }) satisfies Record<keyof GeneratedRoutes, (params: any, body: any) => Promise<ConduitResponse<any>>>;
