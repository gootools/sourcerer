import parse from "./basicParse";
import rustify from "./rustify";

self.onmessage = (e) => {
  self.postMessage(rustify(parse(e.data)));
};
