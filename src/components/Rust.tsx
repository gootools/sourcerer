import React from "react";
import "../lib/rustfmt-wasm/wasm_rustfmt";
import wasmUrl from "../lib/rustfmt-wasm/wasm_rustfmt_bg.wasm?url";
import Editor from "./shared/Editor";

let rustfmt: (code: string) => {
  free(): void;
  code(): string;
  error(): string;
};

window.wasm_bindgen(wasmUrl).then(() => {
  rustfmt = window.wasm_bindgen.rustfmt;
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
        fontSize: 19,
        lineHeight: 28,
        padding: {
          top: 20,
          bottom: 20,
        },
        readOnly: true,
      }}
      defaultLanguage="rust"
      value={rust}
    />
  );
}

export default Rust;
