import { cpi } from "sourcerer";
import { Puppet } from "./puppet";

export class PuppetMaster {
  @cpi(Puppet)
  static pullStrings(data: u64) {
    Puppet.setData(data);
  }
}
