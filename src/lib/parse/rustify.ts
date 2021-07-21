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
          [
            `${
              v.block.toString().includes("this.") ? "" : "_"
            }ctx: Context<${pascalCase(k)}>`,
          ]
        )
        .join(", ");

      return [
        "",
        `pub fn ${snakeCase(k)}(${params}) -> ProgramResult {`,
        ...v.block.map((b) => {
          const [, ctx, accountName, rest] = b.match(/(this)\.(\w+)\.?(.*)/);
          return ["ctx.accounts", snakeCase(accountName), rest].join(".");
        }),
        "Ok(())",
        `}`,
      ];
    }),
    `}`,
    "",
    ...Object.entries(program.instructions).flatMap(([k, v]) => {
      let arr = v.decorators.flatMap((d) => parseDecorator(d));
      if (arr.length === 0) {
        arr = parse(v.block);
      }
      return [
        "#[derive(Accounts)]",
        `pub struct ${pascalCase(k)}${
          v.decorators.length > 0 || String(v.block).includes("this.")
            ? "<'info>"
            : ""
        } {`,
        ...arr,
        `}`,
        "",
      ];
    }),
    ...Object.entries(program.accounts)
      .filter(([, v]) => Object.keys(v).length > 0)
      .flatMap(([k, v]) => {
        const fields = Object.entries(v).reduce((acc, [k, v]) => {
          acc.push(`pub ${snakeCase(k)}: ${type(v)},`);
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

function parseDecorator(d: string) {
  let match = d.match(/@init\("(.+)"\)/);
  if (match?.[1]) {
    return [
      "#[account(init)]",
      `pub ${snakeCase(match[1])}: ProgramAccount<'info, ${pascalCase(
        match[1]
      )}>,`,
      `pub rent: Sysvar<'info, Rent>,`,
    ];
  }
  match = d.match(/@signer\("(.+)"\)/);
  if (match?.[1]) {
    return ["#[account(signer)]", `pub ${match[1]}: AccountInfo<'info>,`];
  }

  try {
    match = d.match(/@mut\(([^)]+)\)/m);
    if (match?.[1]) {
      const [account, stuff = {}] = eval(`[${match[1]}]`);

      const parts = Object.entries(stuff)
        .reduce(
          (acc, [k, v]) => {
            acc.push([snakeCase(k), v].join(" = "));
            return acc;
          },
          ["mut"]
        )
        .join(", ");

      return [
        `#[account(${parts})]`,
        `pub ${snakeCase(account)}: ProgramAccount<'info, ${pascalCase(
          account
        )}>,`,
      ];
    }
  } catch (err) {
    console.error(err);
  }

  return [];
  return [`// ${d}`];
}

function parse(block: Array<string> = []) {
  try {
    const b = block.toString();
    const [, ctx, accountName, rest] = b.match(/(this)\.(\w+)\.?(.*)/) ?? [];
    console.log({ b, ctx, accountName, rest });
    if (accountName) {
      return [
        "#[account(mut)]",
        `pub ${snakeCase(accountName)}: ProgramAccount<'info, ${pascalCase(
          accountName
        )}>,`,
      ];
    }
  } catch (err) {
    console.error(err);
  }
  return [];
}
