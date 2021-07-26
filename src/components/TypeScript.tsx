import { BeforeMount, OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo } from "react";
import defaultValue from "../lib/parse/tests/basic1/basic1?raw";
import Worker from "../lib/parse/worker.ts?worker";
import sourcerer from "../lib/sourcerer.ts?raw";
import types from "../types.d.ts?raw";
import Editor from "./shared/Editor";

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

  const handleEditorDidMount: OnMount = (_editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      "types.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      // sourcerer.replace(/^(\s+)?export(\s+)/gm, ""),
      sourcerer,
      "sourcerer.ts"
    );

    const defaults = {
      allowJs: false,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      noImplicitAny: true,
      noUnusedLocals: true,
      paths: {
        sourcerer: ["sourcerer.ts"],
      },
      strict: true,
      strictPropertyInitialization: false,
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      ...defaults,
    });

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
      ...defaults,
    });
  };

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      onChange={(value) => {
        if (value) worker.postMessage(value);
      }}
      onMount={handleEditorDidMount}
      defaultLanguage="typescript"
      defaultValue={defaultValue}
    />
  );
}

export default TypeScript;
