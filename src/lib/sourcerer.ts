// import "reflect-metadata";

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
export function mut(accountName: string, opts: MutOpts = {}) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {};
}

export function hasOne(pubkey: string) {
  return Reflect.metadata(Symbol("hasOne"), pubkey);
}

export class AnchorProgram {
  constructor(publicKey: Pubkey) {}
}
