import { trim } from "rambda";
import { Node, Project, PropertyDeclaration, SyntaxKind } from "ts-morph";

type PropertyType = "string" | Record<string, { type: PropertyType }>;
interface Property {
  type: PropertyType;
  constraints?: Array<string>;
}
export interface Program {
  name?: string;
  properties: Record<string, Property>;
  methods: Record<
    string,
    {
      params?: Record<string, string>;
      block?: Array<string>;
    }
  >;
}

/**
 * Parses raw typescript into a Program interface
 */
export const parse = (ts: string): Array<Program> => {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("program.ts", ts);

  return sourceFile.getClasses().map((klass) => {
    const program: Program = {
      name: klass.getName(),
      properties: {},
      methods: {},
    };

    klass.forEachChild((node) => {
      if (Node.isPropertyDeclaration(node)) {
        const [name, account] = parseAccount(node);
        program.properties[name] = account;
      } else if (Node.isMethodDeclaration(node)) {
        const block =
          node.getBodyText()?.split("\n").map(trim).filter(Boolean) ?? [];

        const params = node.getParameters().reduce((acc, curr) => {
          const [name, type] = curr.getText().split(":").map(trim);
          acc[name] = type;
          return acc;
        }, {} as Record<string, string>);

        program.methods[node.getName()] = {
          params: Object.keys(params).length > 0 ? params : undefined,
          block: block.length > 0 ? block : undefined,
        };
      }
    });

    return program;
  });
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
