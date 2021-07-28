import { AnchorProgram } from "./anchorize";

const rustify = (a: AnchorProgram): string => {
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

export default rustify;
