import pascalCase from "just-pascal-case";
import snakeCase from "just-snake-case";
import { Program } from "./typescript";

export interface AnchorProgram {
  name: string;
  instructions: Record<string, any>;
  derived: Record<string, any>;
  accounts: Record<string, Account>;
}

type Account = Record<string, string>;

/**
 * Converts an array of parsed Programs into an array of AnchorPrograms
 */
export const anchorify = (programs: Array<Program>): Array<AnchorProgram> =>
  programs.map((program) => ({
    name: snakeCase(program.name!),
    instructions: Object.entries(program.methods).reduce((acc, [k, v]) => {
      acc[snakeCase(k)] = {
        derived: pascalCase(k),
      };
      return acc;
    }, {} as AnchorProgram["instructions"]),
    derived: Object.entries(program.methods).reduce((acc, [k, v]) => {
      acc[pascalCase(k)] = {};
      return acc;
    }, {} as AnchorProgram["derived"]),
    accounts: Object.entries(program.properties).reduce((acc, [k, v]) => {
      acc[pascalCase(k)] = Object.entries(v.type).reduce((acc, [k, v]) => {
        acc[k] = convertType(v.type);
        return acc;
      }, {} as Account);
      return acc;
    }, {} as AnchorProgram["accounts"]),
  }));

const convertType = (tsType: string) => {
  switch (tsType) {
    case "Pubkey":
      return "Pubkey";
    default:
      return tsType.toLowerCase();
  }
};
