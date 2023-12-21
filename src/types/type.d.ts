declare const tag: unique symbol;

declare type InvariantProperty<T> = (arg: T) => T;

declare type InvariantSignature<T> = {
  readonly [tag]: InvariantProperty<T>;
};
