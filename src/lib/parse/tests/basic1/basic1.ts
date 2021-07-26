import { init } from "sourcerer";

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
