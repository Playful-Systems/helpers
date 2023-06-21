import { z } from "zod";

export const Id = z.union([z.string(), z.number()]);
export type Id = z.infer<typeof Id>;