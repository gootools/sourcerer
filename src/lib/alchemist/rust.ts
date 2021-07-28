import { AnchorProgram } from "./anchor";

/**
 * Serializes an AnchorProgram into Rust code
 */
export const rustify = (anchorPrograms: Array<AnchorProgram>): string =>
  anchorPrograms
    .reduce(
      (acc, anchorProgram) =>
        acc.concat([
          `mod ${anchorProgram.name} {`,
          "use super::*;",
          ...Object.entries(anchorProgram.instructions).flatMap(([k, v]) => {
            const params = Object.entries(v?.params ?? {})
              .reduce((acc, [k, v]) => {
                acc.push(`${k}: ${v}`);
                return acc;
              }, [] as Array<string>)
              .join(", ");

            return [
              "",
              `pub fn ${k}(${params}) -> ProgramResult {`,
              // ...v.block.map((b) => {
              //   const [, _ctx, accountName, rest] = b.match(/(this)\.(\w+)\.?(.*)/);
              //   return ["ctx.accounts", snakeCase(accountName), rest].join(".");
              // }),
              "Ok(())",
              `}`,
            ];
          }),
          "}",
          ...Object.entries(anchorProgram.derived).flatMap(([k, v]) => {
            // let arr = v.decorators.flatMap((d) => parseDecorator(d));
            // if (arr.length === 0) {
            //   arr = parse(v.block);
            // }
            return [
              "#[derive(Accounts)]",
              `pub struct ${k}${
                v.decorators?.length > 0 || String(v.block).includes("this.")
                  ? "<'info>"
                  : ""
              } {`,
              // ...arr,
              `}`,
              "",
            ];
          }),
          ...Object.entries(anchorProgram.accounts)
            .filter(([, v]) => Object.keys(v).length > 0)
            .flatMap(([k, v]) => {
              const fields = Object.entries(v).reduce((acc, [k, v]) => {
                acc.push(`pub ${k}: ${v},`);
                return acc;
              }, [] as string[]);

              return [`#[account]`, `pub struct ${k} {`, ...fields, `}`, ""];
            }),
        ]),
      ["use anchor_lang::prelude::*;", "#[program]"]
    )
    .join("\n");
