import camelCase from "lodash/camelCase";
import capitalize from "lodash/capitalize";
import snakeCase from "lodash/snakeCase";
import { Project } from "ts-morph";

const pascalCase = (str: string) => capitalize(camelCase(str));

self.onmessage = (e) => {
  self.postMessage(rustify(parse(e.data)));
};

interface Program {
  name?: string;
  accounts: Record<string, any>;
  instructions: Record<string, Record<string, string>>;
}

const rustify = (program: Program): string => {
  return [
    "use anchor_lang::prelude::*;",
    "#[program]",
    `mod ${snakeCase(program.name)} {`,
    `use super::*;`,
    `}`,
    ...Object.entries(program.accounts).flatMap(([k]) => {
      return [
        `#[account]`,
        `pub struct ${pascalCase(k)} {`,
        // `pub data: u64,`,
        `}`,
      ];
    }),
  ].join("\n");
};

const parse = (data: string): Program => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("program.ts", data);

  const program: Program = {
    accounts: {},
    instructions: {},
  };

  const sourceFile = project.getSourceFileOrThrow("program.ts");
  sourceFile.getClasses().forEach((klass) => {
    program.name = klass.getName();

    klass.getProperties().forEach((prop) => {
      program.accounts[prop.getName()] = {};
    });

    klass.getMethods().forEach((instruction) => {
      program.instructions[instruction.getName()] ??= {};

      instruction.getParameters().forEach((param) => {
        program.instructions[instruction.getName()][param.getName()] = param
          .getType()
          .getText()
          .replace(/[^a-z0-9]/gi, "");
      });
    });
  });

  return program;
};

// export default parse;
