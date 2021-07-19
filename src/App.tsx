import React, { useState } from "react";
import Rust from "./components/Rust";
import TypeScript from "./components/TypeScript";

const App = () => {
  const [rust, setRust] = useState("");

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ flex: 3 }}>
        <TypeScript setRust={setRust} />
      </div>
      <div
        style={{
          flex: 4,
          // filter: "invert(1) brightness(.8) contrast(1)",
          filter:
            // "invert(83%) sepia(20%) saturate(188%) hue-rotate(263deg) brightness(67%) contrast(217%)",
            "invert(92%) sepia(50%) saturate(228%) hue-rotate(263deg) brightness(67%) contrast(217%)",
          // "invert(83%) sepia(20%) saturate(188%) hue-rotate(183deg) brightness(67%) contrast(127%)",
          // "invert(93%) sepia(15%) saturate(258%) hue-rotate(80deg) brightness(65%) contrast(170%)",
        }}
      >
        <Rust rust={rust} />
      </div>
    </div>
  );
};
export default App;
