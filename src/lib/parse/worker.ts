import parse from "./parse";
import rustify from "./rustify";

self.onmessage = (e) => {
  // @ts-ignore
  self.postMessage(rustify(parse(e.data)));
};
