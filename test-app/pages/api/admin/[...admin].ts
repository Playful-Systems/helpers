import { adminHandler } from "@playful-systems/helpers/lib/adminHandler";
import { z } from "zod";

export default adminHandler({
  api_key: "test-key",
  features: {
    users: {
      columns: [
        {
          name: "id",
          label: "ID",
          type: "string",
          schema: z.string(),
        },
        {
          name: "name",
          label: "Name",
          type: "string",
          schema: z.string(),
        },
        {
          name: "age",
          label: "Age",
          type: "number",
          schema: z.number().min(0).max(100),
        },
        {
          name: "birthday",
          label: "Birthday",
          type: "date",
          schema: z.date(),
        },
        {
          name: "is_admin",
          label: "Is Admin",
          type: "boolean",
          schema: z.boolean(),
        },
        {
          name: "avatar",
          label: "Avatar",
          type: "img",
          schema: z.string().url(),
        },
      ],
      cursor: "id",
      listUsers: async (amount, cursor, direction) => {
        return [
          {
            id: "1",
            name: "Bob",
            age: 21,
            birthday: new Date(),
            is_admin: false,
            avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
          },
          {
            id: "2",
            name: "Alice",
            age: 21,
            birthday: new Date(),
            is_admin: true,
            avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
          },
        ];
      },
      viewUser: async (userId) => {
        return {
          id: "1",
          name: "Bob",
          age: 21,
          birthday: new Date(),
          is_admin: false,
          avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
        };
      },
      searchUsers: async (query) => {
        return [
          {
            id: "2",
            name: "Alice",
            age: 21,
            birthday: new Date(),
            is_admin: true,
            avatar: "https://avatars.githubusercontent.com/u/1158253?v=4",
          },
        ];
      },
      updateUser: async (userId, data) => {
        return;
      },
      deleteUser: async (userId) => {
        return;
      },
      createUser: async (data) => {
        return "1";
      },
      countUsers: async () => {
        return 2;
      },
    },
  },
});
