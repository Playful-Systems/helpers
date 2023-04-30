import Axios from "axios";
import { buildApi } from "@playful-systems/helpers/lib/api";
import { it, expect } from "vitest";

const axios = Axios.create({
  baseURL: "http://0.0.0.0:3000/api/admin",
  headers: {
    authorization: "Bearer test-key",
  },
});
const api = buildApi(axios);

it("should return the number of users", async () => {
  const response = await api["/users/count"]();

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual({ count: 2 });
});

it("should create a new user", async () => {
  const response = await api["/users/create"](
    {},
    {
      name: "John",
      age: 21,
      is_admin: false,
      avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
    },
  );

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual("3");
});

it("should delete the user", async () => {
  const response = await api["/users/delete"]({ userId: "1" });

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual(undefined);
});

it("should return the list of users", async () => {
  const response = await api["/users/list"]({});

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual([
    {
      id: "1",
      name: "Bob",
      age: 21,
      is_admin: false,
      avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
    },
    {
      id: "2",
      name: "Alice",
      age: 21,
      is_admin: true,
      avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
    },
  ]);
});

it("should search for a user", async () => {
  const response = await api["/users/search"]({ query: "ali" });

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual([
    {
      id: "2",
      name: "Alice",
      age: 21,
      is_admin: true,
      avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
    },
  ]);
});

it("should return the table details", async () => {
  const response = await api["/users/table"]();

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual({
    columns: [
      {
        name: "id",
        label: "ID",
        type: "string",
      },
      {
        name: "name",
        label: "Name",
        type: "string",
      },
      {
        name: "age",
        label: "Age",
        type: "number",
      },
      {
        name: "is_admin",
        label: "Is Admin",
        type: "boolean",
      },
      {
        name: "avatar",
        label: "Avatar",
        type: "img",
      },
    ],
    userIdKey: "id",
  });
});

it("should update a user", async () => {
  const response = await api["/users/update"](
    { userId: "2" },
    {
      name: "Alice",
      age: 21,
      is_admin: false,
      avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
    },
  );

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual(undefined);
});

it("should return the user", async () => {
  const response = await api["/users/view"]({ userId: "1" });

  if ("error" in response.data) {
    throw new Error(response.data.error);
  }

  expect(response.data.version).toStrictEqual("1");
  expect(response.data.result).toStrictEqual({
    id: "1",
    name: "Bob",
    age: 21,
    is_admin: false,
    avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
  });
});
