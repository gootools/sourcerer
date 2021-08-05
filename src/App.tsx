import React, { useState } from "react";
import type { Data } from "./components/Rust";
import Rust from "./components/Rust";
import TypeScript from "./components/TypeScript";
import "./lib/window";

const App = () => {
  const [data, setData] = useState<Data>();

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 3 }}>
        <TypeScript setRust={setData} />
      </div>
      <div
        style={{
          flex: 4,
          filter:
            "invert(92%) sepia(50%) saturate(318%) hue-rotate(263deg) brightness(67%) contrast(217%)",
        }}
      >
        <Rust data={data} />
      </div>
    </div>
  );
};
export default App;
