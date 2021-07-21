import { init, mut, Pubkey, signer, u64 } from "../extras";

export class Basic2 {
  counter: {
    authority: Pubkey;
    count: u64;
  };
  @init("counter")
  create(authority: Pubkey) {
    this.counter.count = 0;
    this.counter.authority = authority;
  }
  @mut("counter", { hasOne: "authority" })
  @signer("authority")
  increment() {
    this.counter.count += 1;
  }
}
