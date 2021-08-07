import pascalCase from "just-pascal-case";
import snakeCase from "just-snake-case";
import { removeEmptyValues } from "./common";
import { Program } from "./typescript";

type Block = Array<string>;

export interface AnchorProgram {
  name: string;
  instructions: Record<
    string,
    {
      params: Record<string, string>;
      block?: Block;
    }
  >;
  derived: Record<string, Array<string>>;
  accounts: Record<string, Account>;
}

type Account = Record<string, string>;

/**
 * Converts an array of parsed Programs into an array of AnchorPrograms
 */
export const anchorify = (programs: Array<Program>): Array<AnchorProgram> =>
  programs.map((program) =>
    removeEmptyValues({
      name: snakeCase(program.name || ""),

      instructions: Object.entries(program.methods).reduce((acc, [k, v]) => {
        const block = v.block
          ?.map((b) => {
            try {
              const [, accountName, rest] = b.match(/^this\.(\w+)\.?(.*)/)!;
              return ["ctx.accounts", snakeCase(accountName), rest].join(".");
            } catch (err) {}
          })
          .filter(Boolean) as Block;

        acc[snakeCase(k)] = {
          params: {
            [v.block?.toString().includes("this.")
              ? "ctx"
              : "_ctx"]: `Context<${pascalCase(k)}>`,
            ...Object.entries(v.params ?? {}).reduce((acc, [k, v2]) => {
              // v.block?.toString().includes(`this.${program.name}.${k}`)
              //   ? k
              //   : `_${k}`
              acc[k] = convertType(v2);
              return acc;
            }, {} as Record<string, string>),
          },
          block,
        };
        return acc;
      }, {} as AnchorProgram["instructions"]),

      derived: Object.entries(program.methods).reduce((acc, [k, v]) => {
        let key = pascalCase(k);
        if (v.block?.toString().includes("this.")) key = key.concat("<'info>");
        const list: Array<string> = [
          ...(v.decorators ?? []).flatMap(parseDecorator),
        ];

        const idx = list.findIndex((x) => x === "#[account(mut)]");
        if (idx >= 0) {
          Object.values(program.properties).forEach((v) => {
            Object.keys(v.type).forEach((key) => {
              if (v.decorators?.includes(`@hasOne("${key}")`)) {
                list[idx] = `#[account(mut, has_one = ${key})]`;
                list.push("#[account(signer)]");
                list.push(`pub ${key}: AccountInfo<'info>,`);
              }
            });
          });
        }

        acc[key] = list;
        return acc;
      }, {} as AnchorProgram["derived"]),

      accounts: Object.entries(program.properties)
        .filter(([, v]) => typeof v.type !== "string")
        .reduce((acc, [k, v]) => {
          acc[pascalCase(k)] = Object.entries(v.type).reduce((acc, [k, v]) => {
            acc[k.replaceAll("?", "")] = convertType(v.type);
            return acc;
          }, {} as Account);

          return acc;
        }, {} as AnchorProgram["accounts"]),
    })
  );

const convertType = (tsType: string) => {
  switch (tsType) {
    case "Pubkey":
      return "Pubkey";
    case "string":
      return "String";
    case "Vec":
      return "Vec";
    default:
      return tsType;
    // return tsType.toLowerCase();
  }
};

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
      // TODO: don't eval!
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
  // return [`// ${d}`];
}
