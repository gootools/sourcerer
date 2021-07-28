import { pipe } from "rambda";
import { anchorify } from "./anchor";
import { rustify } from "./rust";
import { parse } from "./typescript";

self.onmessage = (e) => {
  // @ts-ignore
  self.postMessage(pipe(parse, anchorify, rustify)(e.data));
};
