import { pipe } from "rambda";
import { anchorify } from "./anchor";
import { rustify } from "./rust";
import { parse } from "./typescript";

/**
 * Use webworker to parse and convert raw TypeScript
 * code into anchor and rust
 */
self.onmessage = (e) => {
  const encoded = btoa(e.data);
  const anchor = pipe(parse, anchorify)(e.data);
  const rust = rustify(anchor);
  // @ts-ignore
  self.postMessage({ encoded, anchor, rust });
};
