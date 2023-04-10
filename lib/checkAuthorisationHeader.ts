import { ApiError } from "next-json-api";
import type { NextApiRequest } from "next";

export const checkAuthorisationHeader = (req: NextApiRequest, ADMIN_API_KEY: string) => {
  if (req.headers.authorization !== `Bearer ${ADMIN_API_KEY}`) {
    throw new ApiError("Unauthorized (401)", "The api key doesn't match");
  }
}