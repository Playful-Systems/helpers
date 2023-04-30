import type { NextApiRequest } from 'next';

export function getUrl(req: NextApiRequest) {

  if (!req.url) {
    throw new Error("No url found");
  }

  return new URL(req.url, `http://${req.headers.host ?? "localhost"}`);
}
