import { Project } from "ts-morph";

self.onmessage = (e) => {
  self.postMessage(parse(e.data));
};

const parse = (data: string): any => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("p.ts", data);
  // project.addSourceFileAtPath("p.ts");

  interface Prog {
    name?: string;
    accounts: Record<string, any>;
    instructions: Record<string, Record<string, string>>;
  }

  const Program: Prog = {
    accounts: {},
    instructions: {},
  };

  const sourceFile = project.getSourceFileOrThrow("p.ts");
  sourceFile.getClasses().forEach((klass) => {
    Program.name = klass.getName();

    klass.getProperties().forEach((prop) => {
      Program.accounts[prop.getName()] = {};
    });

    klass.getMethods().forEach((instruction) => {
      Program.instructions[instruction.getName()] ??= {};

      instruction.getParameters().forEach((param) => {
        Program.instructions[instruction.getName()][param.getName()] = param
          .getType()
          .getText()
          .replace(/[^a-z0-9]/gi, "");
      });
    });
  });

  return Program;
};

// export default parse;
