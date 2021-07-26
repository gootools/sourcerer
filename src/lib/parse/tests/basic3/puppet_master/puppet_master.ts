import { Pubkey, u64 } from "../../extras";
import { Puppet } from "../puppet/puppet";

export class PuppetMaster {
  puppetProgram: Pubkey;

  pullStrings(data: u64) {
    new Puppet(this.puppetProgram).setData(data);
  }
}
