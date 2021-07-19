import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import parse from "../parse";
import rustify from "../rustify";

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

getDirectories(__dirname).forEach((dir) => {
  const typescript = readFileSync(
    join(__dirname, dir, `${dir}.ts`)
  )?.toString();

  const rust = readFileSync(join(__dirname, dir, `${dir}.rs`))?.toString();

  if (typescript && rust) {
    test(dir, () => {
      expect(rustify(parse(typescript)).replace(/\s/g, "")).toEqual(
        rust.replace(/\s/g, "")
      );
    });
  }
});
