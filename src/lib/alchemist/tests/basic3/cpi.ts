import { cpi, init, mut } from "sourcerer";

class Puppet {
  static puppet: {
    data?: U64;
  };

  @init("puppet")
  static initialize() {}

  @mut("puppet")
  static setData(data: U64) {
    this.puppet.data = data;
  }
}

class PuppetMaster {
  @cpi(Puppet)
  static pullStrings(data: U64) {
    Puppet.setData(data);
  }
}
