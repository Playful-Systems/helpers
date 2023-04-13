import type { NextApiRequest, NextApiResponse } from "next";
import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import { parseReq } from "../../parseReq";
import { z } from "zod";

export function CreateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const schemas = {
    params: z.object({}),
    body: z.object(config.columns
      .reduce((acc, column) => {
        acc[column.name] = column.schema;
        return acc;
      // }, {} as Record<keyof UserItem, z.ZodType>)
      }, {} as { [key: keyof UserItem]: z.ZodType })
    )
  }

  return async function CreateUsersHandler(req: NextApiRequest, res: NextApiResponse) {

    const { url, params, body } = parseReq(req, schemas);

    console.log(body)

    const result = await config.createUser(body);

    const response = {
      version: "1",
      // result: result,
      // table: {
      //   columns: config.columns
      // },
      params
    }

    res.write(JSON.stringify(response));
    res.end();

    return response;
  }
}

export type UsersListResponse = Awaited<ReturnType<ReturnType<typeof CreateUser>>>