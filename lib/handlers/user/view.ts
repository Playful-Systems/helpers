import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { userId, type UsersConfig } from ".";
import type { AppConfig } from "../../adminHandler";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  userId
})

export type ViewUserParams = z.input<typeof paramsSchema>;

export function ViewUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {
  return async function ViewUserHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {
      
      const params = parseParams(url, paramsSchema);
  
      const result = await config.viewUser(params.userId);
  
      const response = {
        version: "1",
        result,
      } as const
  
      res.json(response);
      return response;
  }
}

export type ViewUserResponse = Awaited<ReturnType<ReturnType<typeof ViewUser>>>