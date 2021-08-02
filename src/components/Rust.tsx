import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import React, { useState } from "react";
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

function Rust({
  data: { anchor, rust },
}: {
  data: { anchor: any; rust: string };
}) {
  const [tab, setTab] = useState(0);

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

  // const handleEditorDidMount: OnMount = (editor, monaco) => {
  //   const model = monaco.editor.createModel(rust);
  //   editor.setModel(model);
  // };

  return (
    <>
      {Array.isArray(anchor) && anchor.length > 1 && (
        <Tabs
          allowScrollButtonsMobile
          aria-label="tabs"
          onChange={(_, idx) => setTab(idx)}
          scrollButtons
          value={tab}
          variant="scrollable"
        >
          {anchor.map(({ name }: { name: string }) => (
            <Tab
              label={`${name}.rs`}
              style={{ textTransform: "none" }}
              key={name}
            />
          ))}
        </Tabs>
      )}
      <Editor
        defaultLanguage="rust"
        options={{
          fontSize: 19,
          lineHeight: 28,
          padding: {
            top: 20,
            bottom: 20,
          },
          readOnly: true,
          // model: null,
        }}
        value={rust}
        // onMount={handleEditorDidMount}
      />
    </>
  );
}

export default Rust;
