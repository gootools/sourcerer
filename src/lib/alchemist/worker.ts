import { pipe } from "rambda";
import { anchorify } from "./anchor";
import { rustify } from "./rust";
import { parse } from "./typescript";

self.onmessage = (e) => {
  const anchor = pipe(parse, anchorify)(e.data);
  const rust = rustify(anchor);
  // @ts-ignore
  self.postMessage({ anchor, rust });
};
