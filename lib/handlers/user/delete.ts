import type { AppConfig } from "../../adminHandler";
import type { UsersConfig } from ".";
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { parseParams } from "../../parseParams";

const paramsSchema = z.object({
  userId: z.string()
})

export type DeleteUserParams = z.input<typeof paramsSchema>;

export function DeleteUser<UserItem extends object>(app: AppConfig, config: UsersConfig<UserItem>) {  
  return async function DeleteUserHandler(req: NextApiRequest, res: NextApiResponse, url: URL) {
        
        const params = parseParams(url, paramsSchema);
    
        const result = await config.deleteUser(params.userId);
    
        const response = {
          version: "1",
          result,
        } as const
    
        res.json(response);
        return response;
    }
}

export type DeleteUserResponse = Awaited<ReturnType<ReturnType<typeof DeleteUser>>>