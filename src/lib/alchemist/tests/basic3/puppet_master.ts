import { cpi } from "sourcerer";
import { Puppet } from "./puppet";

export class PuppetMaster {
  @cpi(Puppet)
  static pullStrings(data: U64) {
    Puppet.setData(data);
  }
}
