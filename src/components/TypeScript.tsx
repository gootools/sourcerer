import { BeforeMount, OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo } from "react";
import defaultValue from "../lib/parse/tests/basic0/basic0?raw";
import extras from "../lib/parse/tests/extras.ts?raw";
import Worker from "../lib/parse/worker.ts?worker";
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
      defaultLanguage="typescript"
      defaultValue={defaultValue}
    />
  );
}

export default TypeScript;
