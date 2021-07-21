import { AnchorProgram, hasOne, u64 } from "../extras";

export class Puppet extends AnchorProgram {
  @hasOne("authority")
  puppet: {
    data?: u64;
  };

  initialize() {
    this.puppet = {};
  }

  setData(data: u64) {
    this.puppet.data = data;
  }
}
