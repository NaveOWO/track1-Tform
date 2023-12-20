import { getInvariantObjectEntries, invariantOf } from "./invariantType";

export const extractObjectWithEntries = <T extends Record<string, object>>(
  obj: T,
  targetProperty: keyof T[keyof T]
) => {
  return Object.fromEntries(
    getInvariantObjectEntries(invariantOf(obj)).map((item) => [
      item[0],
      item[1][targetProperty],
    ])
  );
};
