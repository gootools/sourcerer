import capitalize from "lodash/capitalize";
import snakeCase from "lodash/snakeCase";
import { Program } from "./newParse";

const pascalCase = (str: string) =>
  snakeCase(str).split("_").map(capitalize).join("");

export interface AnchorProgram {
  name: string;
  instructions: {};
  derived: {};
  accounts: Record<string, Record<string, string>>;
}

export const anchorize = (program: Program) => {
  return {
    name: snakeCase(program.name),
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
