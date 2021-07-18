import {
  MethodDeclaration,
  Node,
  Project,
  PropertyDeclaration,
} from "ts-morph";

export interface Program {
  name?: string;
  accounts: any;
  instructions: any;
}

const basicParse = (data: string): Program => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("program.ts", data);

  const program: Program = {
    accounts: {},
    instructions: {},
  };

  const sourceFile = project.getSourceFileOrThrow("program.ts");
  sourceFile
    .getClasses()
    .slice(0, 1)
    .forEach((klass) => {
      program.name = klass.getName();

      klass.forEachChild((node) => {
        if (Node.isPropertyDeclaration(node)) {
          const { name, fields } = parseAccount(node);
          program.accounts[name] = fields;
        } else if (Node.isMethodDeclaration(node)) {
          const { name, params, decorators } = parseInstruction(node);
          program.instructions[name] = { params, decorators };
        } else {
          // console.log(node.getText());
        }
      });

      // klass.getProperties().forEach((account) => {
      //   program.accounts[account.getName()] = {};
      //   console.log(account.getNextSibling()?.getText());
      // });

      // klass.getMethods().forEach((instruction) => {
      //   program.instructions[instruction.getName()] ??= {};

      //   instruction.getParameters().forEach((param) => {
      //     // const realType = param
      //     //   .getType()
      //     //   .getText()
      //     //   .replace(/[^a-z0-9]/gi, "");

      //     const [paramName, type] = param
      //       .getText()
      //       .split(":")
      //       .map((x) => x.trim())
      //       .filter(Boolean);

      //     program.instructions[instruction.getName()].params = {
      //       ...(program.instructions[instruction.getName()].params || {}),
      //       // [param.getName()]: type,
      //       [paramName]: type,
      //     };
      //   });
      // });
    });

  return program;
};

export default basicParse;

function parseInstruction(node: MethodDeclaration) {
  const instruction = {
    name: node.getName(),
    params: {},
    decorators: [],
  };

  node.forEachChild((node) => {
    if (Node.isDecorator(node)) {
      // switch (node.getName()) {
      //   case "init":
      //   // console.log(node.getText());
      //   case "signer":
      // }
      instruction.decorators.push(node.getText());
    } else if (Node.isParameterDeclaration(node)) {
      const [name, type] = node
        .getText()
        .split(":")
        .map((x) => x.trim())
        .filter(Boolean);
      instruction.params[name] = type;
    }
  });
  return instruction;
}

function parseAccount(node: PropertyDeclaration) {
  const account = {
    name: node.getName(),
    fields: {},
  };

  node.forEachChild((node) => {
    if (Node.isTypeLiteralNode(node)) {
      node.forEachChild((node) => {
        const [name, type] = node
          .getText()
          .split(";")
          .shift()!
          .split(":")
          .map((x) => x.trim());
        account.fields[name] = type;
      });
    }
  });
  return account;
}
