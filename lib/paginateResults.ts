export function paginateResults<UserItem extends object>(
  result: UserItem[],
  direction: "forwards" | "backwards",
  cursor: number | string | undefined,
  cursorKey: keyof UserItem,
  amount: number
) {
  const hasExtraResult = result.length > amount;

  if (direction === "forwards") {
    const viewableResults = result.slice(0, amount);
    const nextCursor = hasExtraResult ? result[amount]?.[cursorKey] ?? null : null;
    const newCursor = {
      back: cursor ?? null,
      next: nextCursor,
    };
    return { viewableResults, cursor: newCursor };
  } else {
    const prevCursor = hasExtraResult ? result[amount - 1]?.[cursorKey] ?? null : null;
    const nextCursor = result.length > 0 ? result[0]?.[cursorKey] ?? null : null;
    const newCursor = {
      back: prevCursor,
      next: nextCursor,
    };
    const viewableResults = hasExtraResult ? result.slice(0, amount).reverse() : result.reverse();
    return { viewableResults, cursor: newCursor };
  }
}
