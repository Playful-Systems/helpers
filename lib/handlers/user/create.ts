import type { NextApiRequest, NextApiResponse } from "next";
import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import { z } from "zod";

export function CreateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const bodySchema = z.object(config.columns
    .reduce((acc, column) => {
      acc[column.name] = column.schema;
      return acc;
    }, {} as Record<keyof UserItem, z.ZodType>)
  )

  return async function CreateUsersHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {

    const body = bodySchema.parse(req.body);

    console.log(body)

    const result = await config.createUser(body);

    const response = {
      version: "1",
      result,
      body
    }

    res.json(response);

    return response;
  }
}

export type UsersListResponse = Awaited<ReturnType<ReturnType<typeof CreateUser>>>