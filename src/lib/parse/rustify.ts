import capitalize from "lodash/capitalize";
import snakeCase from "lodash/snakeCase";
import type { Program } from "./parse";

const pascalCase = (str: string) =>
  snakeCase(str).split("_").map(capitalize).join("");

const type = (key: string) => {
  switch (key) {
    case "pubKey":
      return "Pubkey";
    case "string":
      return "String";
    default:
      return key;
  }
};

const rustify = (program: Program): string => {
  return [
    "use anchor_lang::prelude::*;",
    "",
    "#[program]",
    `mod ${snakeCase(program.name)} {`,
    `use super::*;`,
    ...Object.entries(program.instructions).flatMap(([k, v]) => {
      const params = Object.entries(v.params)
        .reduce(
          (acc, [k, v]) => {
            acc.push(`${k}: ${type(v)}`);
            return acc;
          },
          [`ctx: Context<${pascalCase(k)}>`]
        )
        .join(", ");

      return [
        "",
        `pub fn ${snakeCase(k)}(${params}) -> ProgramResult {`,
        // `pub data: u64,`,
        "Ok(())",
        `}`,
      ];
    }),
    `}`,
    "",
    ...Object.entries(program.instructions).flatMap(([k]) => {
      return [
        "#[derive(Accounts)]",
        `pub struct ${pascalCase(k)}<'info> {`,
        `}`,
        "",
      ];
    }),
    ...Object.entries(program.accounts)
      .filter(([, v]) => Object.keys(v).length > 0)
      .flatMap(([k, v]) => {
        const fields = Object.entries(v).reduce((acc, [k, v]) => {
          acc.push(`pub ${k}: ${type(v)},`);
          return acc;
        }, [] as string[]);

        return [
          `#[account]`,
          `pub struct ${pascalCase(k)} {`,
          ...fields,
          `}`,
          "",
        ];
      }),
  ].join("\n");
};

export default rustify;
