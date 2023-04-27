import { z } from 'zod';


export const userId = z.union([z.string(), z.number()]);
export type UserId = z.infer<typeof userId>;
