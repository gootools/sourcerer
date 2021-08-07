import "reflect-metadata";

/**
 * Initializes the account
 * @param accountName
 */
export function init<CK extends string>(_accountName: CK) {
  //return function<T extends Base & {[P in CK]: G}> (
  //  target: any,
  //  propertyKey: string,
  //  descriptor: PropertyDescriptor
  //) {
  //};

  return <T extends { [P in CK]: unknown }, K extends keyof T, F extends T[K]>(
    _proto: ProtoOf<T> & { [P in CK]: Record<string, unknown> },
    _propertyKey: K,
    _descriptor: TypedPropertyDescriptor<F>
  ) => {
    // Do stuff.
  };
}

/**
 * Specify the signer account for the instruction
 * @param accountName
 */
export function signer(_accountName: string) {
  return function (
    _target: any,
    _propertyKey: string,
    _descriptor: PropertyDescriptor
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
export function mut<CK extends string>(_accountName: CK, _opts: MutOpts = {}) {
  return <T extends { [P in CK]: unknown }, K extends keyof T, F extends T[K]>(
    _proto: ProtoOf<T> & { [P in CK]: Record<string, unknown> },
    _propertyKey: K,
    _descriptor: TypedPropertyDescriptor<F>
  ) => {
    // Do stuff.
  };
}

export function hasOne(pubkey: string) {
  return Reflect.metadata(Symbol("hasOne"), pubkey);
}

export class AnchorProgram {
  constructor(_publicKey: Pubkey) {}
}

export function cpi(_class: Function) {
  return function (
    _target: any,
    _propertyKey: string,
    _descriptor: PropertyDescriptor
  ) {};
}
