import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import type { UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";
import { userId } from "./UserId";
import { createUserParser } from "./createUserParser";

const paramsSchema = z.object({
  userId
})

export type UpdateUserParams = z.input<typeof paramsSchema>;

export function UpdateUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {

  const bodyParser = createUserParser(config.columns);
  
  return async function UpdateUserHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {
        
        const params = parseParams(url, paramsSchema);
    
        const body = await bodyParser(req.body);
        const result = await config.updateUser(params.userId, body);
    
        const response = {
          version: "1",
          result,
        } as const
    
        res.json(response);
        return response;
    }
}

export type UpdateUserResponse = Awaited<ReturnType<ReturnType<typeof UpdateUser>>>