import { trim } from "rambda";
import { Node, Project, PropertyDeclaration } from "ts-morph";

type PropertyType = "string" | Record<string, { type: PropertyType }>;
interface Property {
  type: PropertyType;
  constraints?: Array<string>;
  decorators?: Array<string>;
}
interface Method {
  decorators?: Array<string>;
  params?: Record<string, string>;
  block?: Array<string>;
}
export interface Program {
  name?: string;
  properties: Record<string, Property>;
  methods: Record<string, Method>;
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

        const decorators =
          node
            .getDecorators()
            .map((d) => trim(d.getText()))
            .filter(Boolean) ?? [];

        const params = node.getParameters().reduce((acc, curr) => {
          const [name, type] = curr.getText().split(":").map(trim);
          acc[name] = type;
          return acc;
        }, {} as Record<string, string>);

        const ob: Method = {};

        if (Object.keys(params).length > 0) ob.params = params;
        if (block.length > 0) ob.block = block;
        if (decorators.length > 0) ob.decorators = decorators;

        program.methods[node.getName()] = ob;
      }
    });

    return program;
  });
};

const parseAccount = (node: PropertyDeclaration): [string, Property] => {
  const decorators =
    node
      .getDecorators()
      .map((d) => trim(d.getText()))
      .filter(Boolean) ?? [];

  const account: Property = {
    type: {},
    decorators: decorators.length > 0 ? decorators : undefined,
  };

  node.forEachChild((node) => {
    if (Node.isDecorator(node)) {
      // const constraint = node
      //   .getFirstDescendantByKind(SyntaxKind.Identifier)
      //   ?.getText();
      // const property = node
      //   .getFirstDescendantByKind(SyntaxKind.StringLiteral)
      //   ?.getText();
      // if (property && constraint) {
      //   (account.type as any)[JSON.parse(property)] = {
      //     constraints: [constraint],
      //   };
      // }
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
