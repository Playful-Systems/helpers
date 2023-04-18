import type { NextApiRequest, NextApiResponse } from 'next'
import { type UsersConfig, registerUserHandlers } from './handlers/user';

export type AppConfig = {
  api_key: string;
  route?: string;
}

type AdminConfig<UserItem extends object> = AppConfig & {
  features?: {
    users?: UsersConfig<UserItem>
  }
}

const defaultConfig = {
  route: "/api/admin"
}

type Route = (req: NextApiRequest, res: NextApiResponse, url: URL) => Promise<any>;
type Routes = Record<string, Route>;

export const adminHandler = <UserItem extends object>(config: AdminConfig<UserItem>) => {

  const adminConfig = mergeConfigs<UserItem>(config);
  const routes = generateRoutes<UserItem>(adminConfig);

  return async (req: NextApiRequest, res: NextApiResponse) => {

    if (req.headers.authorization !== `Bearer ${adminConfig.api_key}`) {
      return res.status(403).json({ error: "Bad Api Key" })
    }

    if (!req.url) {
      throw new Error("No url found");
    }
  
    const url = new URL(req.url, `http://${req.headers.host ?? "localhost"}`);

    // find the route
    const handler = routes[url.pathname.replace(adminConfig.route, '') as "/hello"]

    if (!handler) {
      return res.status(404).json({ error: "Route Not Found" })
    }

    try {
      await handler(req, res, url);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message })
      }
      return res.status(500).json({ error: "Unknown Error" })
    }
  }
}

function mergeConfigs<UserItem extends object>(config: AdminConfig<UserItem>) {
  return { ...defaultConfig, ...config };
}

type FullConfig<UserItem extends object> = ReturnType<typeof mergeConfigs<UserItem>>;

function generateRoutes<UserItem extends object>(adminConfig: FullConfig<UserItem>) {
  return {
    "/hello": async (req, res, url) => res.json({ hello: "world" }),
    ...(adminConfig.features?.users ? registerUserHandlers(adminConfig, adminConfig.features.users) : {})
  } satisfies Routes;
}

export type GeneratedRoutes = ReturnType<typeof generateRoutes>;