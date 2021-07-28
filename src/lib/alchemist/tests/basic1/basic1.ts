import { init, mut } from "sourcerer";

export class Basic_1 {
  myAccount: {
    data: U64;
  };

  @init("myAccount")
  initialize(data: U64) {
    this.myAccount.data = data;
  }

  @mut("myAccount")
  update(data: U64) {
    this.myAccount.data = data;
  }
}
