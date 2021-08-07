export const removeEmptyValues = <T>(ob: T): T =>
  Object.entries(ob).reduce((acc, [k, v]) => {
    if (v !== undefined) {
      (acc as Record<string, unknown>)[k] = v;
    }
    return acc;
  }, {} as T);
