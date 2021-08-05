import type { EditorProps } from "@monaco-editor/react";
import MonacoEditor from "@monaco-editor/react";
import { mergeDeepRight } from "rambda";
import React from "react";

const Editor = (props: EditorProps) => (
  <MonacoEditor
    theme="vs-dark"
    {...props}
    options={mergeDeepRight(
      {
        fontFamily: "'JetBrains Mono', monospace",
        fontLigatures: true,
        fontSize: 19,
        fontWeight: "400",
        lineHeight: 28,
        lineNumbers: "off",
        minimap: { enabled: false },
        padding: {
          top: 20,
          bottom: 20,
        },
        renderLineHighlight: "none",
        scrollbar: { vertical: "auto" },
        scrollBeyondLastLine: false,
      },
      props.options ?? {}
    )}
  />
);

export default Editor;
