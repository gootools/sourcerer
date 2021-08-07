import { init, mut } from "sourcerer";

export class Basic_1 {
  myAccount: {
    data: u64;
  };

  @init("myAccount")
  initialize(data: u64) {
    this.myAccount.data = data;
  }

  @mut("myAccount")
  update(data: u64) {
    this.myAccount.data = data;
  }
}
