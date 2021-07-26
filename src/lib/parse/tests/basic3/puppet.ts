import { AnchorProgram, hasOne } from "../extras";

export class Puppet extends AnchorProgram {
  @hasOne("authority")
  puppet: {
    data?: U64;
  };

  initialize() {
    this.puppet = {};
  }

  setData(data: U64) {
    this.puppet.data = data;
  }
}
