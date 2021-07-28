import { Node, Project, PropertyDeclaration, SyntaxKind } from "ts-morph";

type PropertyType = "string" | Record<string, { type: PropertyType }>;
interface Property {
  type: PropertyType;
  constraints?: Array<string>;
}
export interface Program {
  name?: string;
  properties: Record<string, Property>;
  methods: Record<string, any>;
}

const parse = (ts: string): Array<Program> => {
  const project = new Project({ useInMemoryFileSystem: true });
  project.createSourceFile("program.ts", ts);

  const programs: Array<Program> = [];

  const sourceFile = project.getSourceFileOrThrow("program.ts");
  sourceFile.getClasses().forEach((klass) => {
    const program: Program = {
      name: klass.getName(),
      properties: {},
      methods: {},
    };

    programs.push(program);

    klass.forEachChild((node) => {
      if (Node.isPropertyDeclaration(node)) {
        const [name, account] = parseAccount(node);
        program.properties[name] = account;
      } else if (Node.isMethodDeclaration(node)) {
        program.methods[node.getName()] = {};
      }
    });
  });

  return programs;
};

const parseAccount = (node: PropertyDeclaration): [string, Property] => {
  const account: Property = {
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

export default parse;
