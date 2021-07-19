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

const parse = (data: string): Program => {
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
          const { name, params, decorators, block } = parseInstruction(node);
          program.instructions[name] = { params, decorators, block };
        } else {
          // try {
          //   console.log(node.getText());
          // } catch (err) {}
        }
      });
    });

  return program;
};

export default parse;

function parseInstruction(node: MethodDeclaration) {
  const instruction = {
    name: node.getName(),
    params: {},
    decorators: [],
    block: [],
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
    } else if (node.getKindName() === "Block") {
      // console.log(node.getChildren().map((x) => x.getText()));
      node.forEachChild((n) =>
        n
          .getText()
          .split("\n")
          .forEach((x) => instruction.block.push(x))
      );
    }
  });
  // console.log(instruction.block);
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
