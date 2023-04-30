import type { AxiosInstance, AxiosResponse } from "axios";

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

export const buildApi = (axios: AxiosInstance) =>
  ({
    "/hello": () => axios.get("/hello"),
    "/users/list": (params: ListUsersParams) => axios.get<ListUsersResponse>("/users/list", { params }),
    "/users/view": (params: ViewUserParams) => axios.get<ViewUserResponse>("/users/view", { params }),
    "/users/search": (params: SearchUsersParams) => axios.get<SearchUsersResponse>("/users/search", { params }),
    "/users/update": (params: UpdateUserParams, body: UserObject) =>
      axios.patch<UpdateUserResponse>("/users/update", body, { params }),
    "/users/delete": (params: DeleteUserParams) => axios.delete<DeleteUserResponse>("/users/delete", { params }),
    "/users/create": (params: CreateUserParams, body: UserObject) =>
      axios.post<CreateUserResponse>("/users/create", body, { params }),
    "/users/count": () => axios.get<CountUsersResponse>("/users/count"),
    "/users/table": () => axios.get<TableDetailsResponse>("/users/table"),
    // rome-ignore lint/suspicious/noExplicitAny: when used in satisfies its fine
  }) satisfies Record<keyof GeneratedRoutes, (params: any, body: any) => Promise<AxiosResponse<any>>>;
