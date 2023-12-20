declare const tag: unique symbol;

declare type InvariantProperty<T> = (arg: T) => T;

declare type InvariantSignature<T> = {
  readonly [tag]: InvariantProperty<T>;
};

export type InvariantOf<T> = T & InvariantSignature<T>;

export function invariantOf<T>(value: T): InvariantOf<T> {
  return value as InvariantOf<T>;
}

export function getInvariantObjectKeys<T>(arg: InvariantOf<T>): (keyof T)[] {
  return Object.keys(arg) as unknown as (keyof T)[];
}

export function getInvariantObjectValues<T>(arg: InvariantOf<T>): T[keyof T][] {
  return Object.values(arg) as unknown as T[keyof T][];
}

export function getInvariantObjectEntries<T>(
  arg: InvariantOf<T>
): [keyof T, T[keyof T]][] {
  return Object.entries(arg) as unknown as [keyof T, T[keyof T]][];
}
