import { Node, Project, PropertyDeclaration, SyntaxKind } from "ts-morph";

type AccountType = "string" | Record<string, { type: AccountType }>;
interface Account {
  type?: AccountType;
  constraints?: Array<string>;
}
export interface Program {
  name?: string;
  accounts: Record<string, Account>;
  instructions: any;
}

const newParse = (ts: string): Program => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("program.ts", ts);

  const programs: Array<Program> = [];

  const sourceFile = project.getSourceFileOrThrow("program.ts");
  sourceFile
    .getClasses()
    // XXX: only checking the first class in the file for now
    .slice(0, 1)
    .forEach((klass) => {
      const program: Program = {
        name: klass.getName(),
        accounts: {},
        instructions: {},
      };

      programs.push(program);

      klass.forEachChild((node) => {
        if (Node.isPropertyDeclaration(node)) {
          const [name, account] = parseAccount(node);
          program.accounts[name] = account;
        }
      });
    });

  return programs[0];
};

const parseAccount = (node: PropertyDeclaration): [string, Account] => {
  const account: Account = {
    type: {},
  };

  node.forEachChild((node) => {
    if (Node.isDecorator(node)) {
      const constraint = node
        .getFirstDescendantByKind(SyntaxKind.Identifier)
        ?.getText();

      const property = node
        .getFirstDescendantByKind(SyntaxKind.StringLiteral)
        ?.getText();

      if (property && constraint) {
        (account.type as any)[JSON.parse(property)] = {
          constraints: [constraint],
        };
      }
    } else if (Node.isTypeLiteralNode(node)) {
      node.forEachChild((node) => {
        const [name, type] = node
          .getText()
          .split(";")
          .shift()!
          .split(":")
          .map((x) => x.trim());

        (account.type as any)[name] = {
          ...((account.type as any)[name] ?? {}),
          type,
        };
      });
    }
  });

  return [node.getName(), account];
};

export default newParse;
