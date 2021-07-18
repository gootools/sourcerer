import { Project } from "ts-morph";

export interface Program {
  name?: string;
  accounts: Record<string, any>;
  instructions: any; //Record<string, { params: Record<string, string> }>;
}

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

    klass.getProperties().forEach((account) => {
      program.accounts[account.getName()] = {};

      console.log(account.getNextSibling()?.getText());
    });

    klass.getMethods().forEach((instruction) => {
      program.instructions[instruction.getName()] ??= {};

      instruction.getParameters().forEach((param) => {
        // const realType = param
        //   .getType()
        //   .getText()
        //   .replace(/[^a-z0-9]/gi, "");

        const [paramName, type] = param
          .getText()
          .split(":")
          .map((x) => x.trim())
          .filter(Boolean);

        program.instructions[instruction.getName()].params = {
          ...(program.instructions[instruction.getName()].params || {}),
          // [param.getName()]: type,
          [paramName]: type,
        };
      });
    });
  });

  return program;
};

export default parse;
