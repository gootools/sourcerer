import { init } from "../extras";

export class Basic_1 {
  myAccount: {
    data: U64;
  };

  @init("myAccount")
  initialize(data: U64) {
    this.myAccount.data = data;
  }

  update(data: U64) {
    this.myAccount.data = data;
  }
}
