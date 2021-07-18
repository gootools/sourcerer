import React from "react";

const Rust = ({ rust }: { rust: any }) => (
  <div
    style={{ background: "black", padding: 20, color: "white", height: "100%" }}
  >
    <pre>{JSON.stringify(rust, null, 2)}</pre>
  </div>
);

export default Rust;
