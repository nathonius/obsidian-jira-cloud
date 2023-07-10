export function removeKeys<T extends object>(
  obj: T | undefined,
  keys: readonly string[] = [],
  removeNullish = true,
): Exclude<T, (typeof keys)[number]> {
  if (!obj) {
    return obj as any;
  }
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([k, v]) =>
        !keys.includes(k) &&
        (!removeNullish || (v !== null && v !== undefined)),
    ),
  ) as Exclude<T, (typeof keys)[number]>;
}
