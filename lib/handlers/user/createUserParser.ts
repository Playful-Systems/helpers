import { z } from 'zod';
import { Column } from ".";

export function createUserParser<Item extends object>(
  columns: Array<Column<Item>>
): (body: unknown) => Promise<Item> {
  const bodySchema = z.object(columns
    .reduce((acc, column) => {
      acc[column.name] = column.schema;
      return acc;
    }, {} as Record<keyof Item, z.ZodType>)
  );

  // @ts-expect-error zod doesn't like being built dynamically
  return async (body: unknown) => await bodySchema.parseAsync(body);
}

export type UserObject = Awaited<ReturnType<ReturnType<typeof createUserParser>>>;
export type UserObjectSpecific<Item extends object> = Awaited<ReturnType<ReturnType<typeof createUserParser<Item>>>>;