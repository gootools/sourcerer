import capitalize from "just-capitalize";
import snakeCase from "just-snake-case";
import { Program } from "./newParse";

export interface AnchorProgram {
  name: string;
  instructions: {};
  derived: {};
  accounts: Record<string, Record<string, string>>;
}

export const anchorize = (program: Program) => {
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
