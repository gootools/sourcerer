import { AnchorProgram } from "./anchorize";

export const rustify = (a: AnchorProgram) => {
  return [
    "use anchor_lang::prelude::*;",
    "#[program]",
    `mod ${a.name} {`,
    "use super::*;",
    "}",
    ...Object.entries(a.accounts).flatMap(([k, v]) => [
      "#[account]",
      `pub struct ${k} {`,
      ...Object.entries(v).flatMap(([k, v]) => [`pub ${k}:${v},`]),
      "}",
    ]),
  ].join("\n");
};
