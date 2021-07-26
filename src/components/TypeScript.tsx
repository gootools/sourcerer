import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo } from "react";
import extras from "../lib/parse/tests/extras.ts?raw";
import Worker from "../lib/parse/worker.ts?worker";
import types from "../types.d.ts?raw";

// @anchor
const defaultValue = `// class Basic0 {
//   initialize() {}
// }

// class Basic1 {
//   myAccount: {
//     data: u64
//   }
//   @init("myAccount")
//   initialize(data:u64) {
//     this.myAccount.data = data;
//   }
//   update(data:u64) {
//     this.myAccount.data = data;
//   }
// }

class Basic2 {
  counter: {
    count: u64;
    authority: pubKey;
  }
  @init("counter")
  create(authority:pubKey) {
    this.counter.count = 0;
    this.counter.authority = authority;
  }
  @signer("authority")
  @mut("counter", { hasOne: "authority" })
  update(data:u64) {
    this.counter.count += 1;
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

    import("monaco-themes/themes/Tomorrow-Night-Bright.json").then((data) => {
      monaco.editor.defineTheme("theme", data as any);
      monaco.editor.setTheme("theme");
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    const defaults = {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      ...defaults,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
      ...defaults,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      "types.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      extras.replace(/^(\s+)?export(\s+)/gm, ""),
      "extras.ts"
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
        padding: {
          top: 20,
          bottom: 20,
        },
        lineNumbers: "off",
        renderLineHighlight: "none",
        fontFamily: "JetBrains Mono",
        fontLigatures: true,
        fontWeight: "400",
        lineHeight: 28,
        fontSize: 19,
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
