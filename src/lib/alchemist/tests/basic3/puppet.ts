import { init, mut } from "sourcerer";

export class Puppet {
  static puppet: {
    data?: U64;
  };

  @init("puppet")
  static initialize() {
    this.puppet = {};
  }

  @mut("puppet")
  static setData(data: U64) {
    this.puppet.data = data;
  }
}
