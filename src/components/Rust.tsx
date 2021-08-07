import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import type { RustFile } from "lib/alchemist/rust";
import React, { useEffect, useState } from "react";
import "../lib/rustfmt-wasm/wasm_rustfmt";
import wasmUrl from "../lib/rustfmt-wasm/wasm_rustfmt_bg.wasm?url";
import Editor from "./shared/Editor";

export interface Data {
  anchor: Array<any>;
  rust: Array<RustFile>;
}

const RustEditor = ({ rust }: { rust: Data["rust"] }) => {
  const [tab, setTab] = useState(0);
  let { code } = rust[tab];

  // TODO: move to webworker
  const result = window.wasm_bindgen.rustfmt(code);
  const err = result.error();
  if (err) {
    code = "";
    console.error(err);
  } else {
    code = result.code();
  }
  result.free();

  return (
    <>
      <Tabs
        allowScrollButtonsMobile
        aria-label="tabs"
        onChange={(_, idx) => setTab(idx)}
        scrollButtons
        value={tab >= rust.length ? 0 : tab}
        variant="scrollable"
      >
        {rust.map(({ name }) => (
          <Tab label={name} style={{ textTransform: "none" }} key={name} />
        ))}
      </Tabs>
      <Editor
        defaultLanguage="rust"
        options={{
          fontSize: 15,
          lineHeight: 18,
          padding: {
            top: 20,
            bottom: 20,
          },
          readOnly: true,
        }}
        value={code}
      />
    </>
  );
};

const Rust = ({ data }: { data?: Data }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    window.wasm_bindgen(wasmUrl).then(() => {
      setLoaded(true);
    });
  }, []);

  return data?.rust && loaded ? <RustEditor {...data} /> : null;
};

export default Rust;
