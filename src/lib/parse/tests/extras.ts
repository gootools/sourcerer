import "reflect-metadata";

export type u8 = number;
export type u16 = number;
export type u32 = number;
export type u64 = number;
export type u128 = number;
export type usize = number;

export type i8 = number;
export type i16 = number;
export type i32 = number;
export type i64 = number;
export type i128 = number;
export type isize = number;

export type Pubkey = number;

export type ProtoOf<T> = Pick<T, keyof T>;

/**
 * Initializes the account
 * @param accountName
 */
export function init<CK extends string>(accountName: CK) {
  //return function<T extends Base & {[P in CK]: G}> (
  //  target: any,
  //  propertyKey: string,
  //  descriptor: PropertyDescriptor
  //) {
  //};

  return <
    T extends Base & { [P in CK]: G },
    K extends keyof T,
    F extends T[K] & G,
    R
  >(
    proto: ProtoOf<T> & { [P in CK]: Record<string, unknown> },
    propertyKey: K,
    descriptor: TypedPropertyDescriptor<F>
  ) => {
    // Do stuff.
  };
}

/**
 * Specify the signer account for the instruction
 * @param accountName
 */
export function signer(accountName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {};
}
// function signer<CK extends string>(accountName: CK) {
//   return <
//     T extends Base & {[P in CK]: G},
//     K extends keyof T,
//     F extends T[K] & G,
//     R>(
//       proto: ProtoOf<T> & {[P in CK]: pubKey},
//       propertyKey: K,
//       descriptor: TypedPropertyDescriptor<F>) => {
//     // Do stuff.
//   };
// }

/**
 * Makes an account mutable
 * @param accountName
 * @param opts
 */
interface MutOpts {
  hasOne?: string;
}
export function mut(accountName: keyof this, opts?: MutOpts = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {};
}

export function hasOne(formatString: string) {
  return Reflect.metadata(Symbol("hasOne"), formatString);
}

export class AnchorProgram {
  constructor(publicKey: Pubkey) {}
}
