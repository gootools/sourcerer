import { Puppet } from "./puppet";

export class PuppetMaster {
  puppetProgram: Pubkey;

  pullStrings(data: u64) {
    new Puppet(this.puppetProgram).setData(data);
  }
}
