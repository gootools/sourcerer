export {};

declare global {
  type u8 = number;
  type u16 = number;
  type u32 = number;
  type u64 = number;
  type u128 = number;
  type usize = number;

  type i8 = number;
  type i16 = number;
  type i32 = number;
  type i64 = number;
  type i128 = number;
  type isize = number;

  type pubKey = number;

  type Pubkey = number;

  type ProtoOf<T> = Pick<T, keyof T>;
}
