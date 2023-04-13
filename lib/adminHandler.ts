import type { NextApiRequest, NextApiResponse } from 'next'
import Router from "find-my-way";
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

export const adminHandler = <UserItem extends object>(config: AdminConfig<UserItem>) => {

  const adminConfig = { ...defaultConfig, ...config };

  const app = Router({
    defaultRoute: (req, res) => {
      res.write(JSON.stringify({ error: "Not found" }));
      res.statusCode = 404;
      res.end();
    },
  });

  if (adminConfig.features?.users) {
    registerUserHandlers(app, adminConfig, adminConfig.features.users)
  }

  return (req: NextApiRequest, res: NextApiResponse) => {

    if (req.headers.authorization !== `Bearer ${adminConfig.api_key}`) {
      res.write(JSON.stringify({ error: "Bad Api Key" }))
      res.statusCode = 403;
      res.end();
    }

    // re-write the url to remove the admin route
    req.url = (req.url ?? adminConfig + "/").replace(adminConfig.route, "");

    // find the route
    app.lookup(req, res);

  }
}