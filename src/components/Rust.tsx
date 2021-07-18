import React from "react";

const Rust = ({ rust }: { rust: any }) => (
  <div
    style={{ background: "black", padding: 20, color: "white", height: "100%" }}
  >
    <pre>{rust}</pre>
  </div>
);

export default Rust;
