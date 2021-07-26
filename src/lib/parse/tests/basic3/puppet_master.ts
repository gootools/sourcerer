import { Puppet } from "./puppet";

export class PuppetMaster {
  puppetProgram: Pubkey;

  pullStrings(data: U64) {
    new Puppet(this.puppetProgram).setData(data);
  }
}
