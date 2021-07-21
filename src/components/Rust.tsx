import Editor from "@monaco-editor/react";
import React from "react";
import "../lib/rustfmt-wasm/wasm_rustfmt";
import wasmUrl from "../lib/rustfmt-wasm/wasm_rustfmt_bg.wasm?url";

let rustfmt;
wasm_bindgen(wasmUrl).then(() => {
  rustfmt = wasm_bindgen.rustfmt;
});

function Rust({ rust }: { rust: string }) {
  if (rustfmt) {
    const result = rustfmt(rust);
    const err = result.error();
    if (err) {
      rust = "";
      console.error(err);
    } else {
      rust = result.code();
    }
    result.free();
  }

  return (
    <Editor
      options={{
        padding: {
          top: 10,
          bottom: 10,
        },
        lineNumbers: "off",
        renderLineHighlight: "none",
        fontFamily: "JetBrains Mono",
        fontLigatures: true,
        fontWeight: "400",
        lineHeight: 20,
        fontSize: 17,
        scrollBeyondLastLine: false,
        scrollbar: { vertical: "auto" },
        minimap: { enabled: false },
        readOnly: true,
      }}
      theme="vs-dark"
      defaultLanguage="rust"
      value={rust}
    />
  );
}

export default Rust;
