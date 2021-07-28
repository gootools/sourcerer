import { hasOne, init, mut } from "sourcerer";

export class Basic_2 {
  @hasOne("authority")
  counter: {
    authority: Pubkey;
    count: U64;
  };

  @init("counter")
  create(authority: Pubkey) {
    this.counter.count = 0;
    this.counter.authority = authority;
  }

  @mut("counter")
  increment() {
    this.counter.count += 1;
  }
}
