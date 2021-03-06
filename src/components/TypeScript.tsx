import { BeforeMount, OnMount } from "@monaco-editor/react";
import { mergeDeepRight } from "rambda";
import React, { useEffect, useMemo } from "react";
import fallbackDefaultValue from "../lib/alchemist/tests/basic3/basic3?raw";
import Worker from "../lib/alchemist/worker.ts?worker";
import sourcerer from "../lib/sourcerer.ts?raw";
import types from "../types.d.ts?raw";
import Editor from "./shared/Editor";

const defaultValue: string = (() => {
  try {
    return atob(window.location.hash.split("#")[1]);
  } catch (err) {
    return fallbackDefaultValue;
  }
})();

function TypeScript({ setRust }: { setRust: any }) {
  const worker = useMemo(() => new Worker(), []);
  useEffect(() => {
    const handleMessage = ({ data }: any) => {
      if (data.encoded) window.replaceHash(data.encoded);
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

    // import("monaco-themes/themes/Tomorrow-Night-Bright.json").then((data) => {
    //   monaco.editor.defineTheme("theme", data as any);
    //   monaco.editor.setTheme("theme");
    // });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editor.getModel()?.updateOptions({ tabSize: 2 });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      types,
      "types.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      // sourcerer.replace(/^(\s+)?export(\s+)/gm, ""),
      sourcerer,
      "sourcerer.ts"
    );

    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
    monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);

    const defaults = {
      allowJs: false,
      emitDecoratorMetadata: true,
      experimentalDecorators: true,
      noImplicitAny: true,
      noUnusedLocals: false,
      paths: {
        sourcerer: ["sourcerer.ts"],
      },
      strict: true,
      strictPropertyInitialization: false,
    };

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
      mergeDeepRight(
        monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
        defaults
      )
    );

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
      mergeDeepRight(
        monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
        defaults
      )
    );
  };

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      defaultLanguage="typescript"
      defaultValue={defaultValue}
      onChange={(value) => {
        if (value) worker.postMessage(value);
      }}
      onMount={handleEditorDidMount}
    />
  );
}

export default TypeScript;
