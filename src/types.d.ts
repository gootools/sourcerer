export {};

declare global {
  type U8 = number;
  type U16 = number;
  type U32 = number;
  type U64 = number;
  type U128 = number;
  type Usize = number;

  type I8 = number;
  type I16 = number;
  type I32 = number;
  type I64 = number;
  type I128 = number;
  type Isize = number;

  type Pubkey = number;

  type ProtoOf<T> = Pick<T, keyof T>;
}
