import pascalCase from "just-pascal-case";
import snakeCase from "just-snake-case";
import { Program } from "./typescript";

export interface AnchorProgram {
  name: string;
  instructions: Record<
    string,
    {
      params: Record<string, string>;
      block?: Array<string>;
    }
  >;
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
      const block =
        v.block?.map((b) => {
          const [, _ctx, accountName, rest] = b.match(/(this)\.(\w+)\.?(.*)/)!;
          return ["ctx.accounts", snakeCase(accountName), rest].join(".");
        }) ?? undefined;

      acc[snakeCase(k)] = {
        params: {
          [v.block?.toString().includes("this.")
            ? "ctx"
            : "_ctx"]: `Context<${pascalCase(k)}>`,
          ...Object.entries(v.params ?? {}).reduce((acc, [k, v]) => {
            acc[k] = convertType(v);
            return acc;
          }, {} as Record<string, string>),
        },
        block,
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
