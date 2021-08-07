import { cpi, init, mut } from "sourcerer";

export class Puppet {
  static puppet: {
    data?: u64;
  };

  @init("puppet")
  static initialize() {
    this.puppet = {};
  }

  @mut("puppet")
  static setData(data: u64) {
    this.puppet.data = data;
  }
}

export class PuppetMaster {
  @cpi(Puppet)
  static pullStrings(data: u64) {
    Puppet.setData(data);
  }
}
