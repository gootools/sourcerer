import capitalize from "just-capitalize";
import snakeCase from "just-snake-case";
import { Program } from "./parse";

export interface AnchorProgram {
  name: string;
  instructions: {};
  derived: {};
  accounts: Record<string, Account>;
}

type Account = Record<string, string>;

const anchorize = (program: Program) => {
  return {
    name: snakeCase(program.name!),
    instructions: {},
    derived: {},
    accounts: Object.entries(program.accounts).reduce((acc, [k, v]) => {
      acc[capitalize(k)] = Object.entries(v.type).reduce((acc, [k, v]) => {
        acc[k] = v.type;
        return acc;
      }, {});
      return acc;
    }, {} as AnchorProgram["accounts"]),
  };
};

export default anchorize;
