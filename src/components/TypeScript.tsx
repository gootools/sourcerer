import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo } from "react";
import Worker from "../lib/parse/worker.ts?worker";

const defaultValue = `// @anchor
class Basic1 {
  myAccount: {
    data: u64;
    authority: pubKey;
  };

  // @init("authority")
  initialize(data: u64) {
    this.myAccount.data = data;
  }

  update(data: u64) {
    this.myAccount.data = data;
  }
}`;

function TypeScript({ setRust }: { setRust: any }) {
  const worker = useMemo(() => new Worker(), []);
  useEffect(() => {
    const handleMessage = ({ data }: any) => {
      setRust(data);
    };
    worker.addEventListener("message", handleMessage);
    worker.postMessage(defaultValue);
    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [setRust]);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      type u64 = number;
      type pubKey = number;
      `,
      "types.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      /**
       * Initializes the account
       * @param accountName
       */
      function init(accountName: string) {
        return function (
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
        };
      }

      /**
       * Specify the signer account for the instruction
       * @param accountName
       */
      function signer(accountName: string) {
        return function (
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
        };
      }
      `
    );
  };

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      onChange={(value) => {
        if (value) worker.postMessage(value);
      }}
      onMount={handleEditorDidMount}
      options={{
        fontSize: 15,
        scrollBeyondLastLine: false,
        scrollbar: { vertical: "auto" },
        minimap: { enabled: false },
      }}
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue={defaultValue}
    />
  );
}

export default TypeScript;
