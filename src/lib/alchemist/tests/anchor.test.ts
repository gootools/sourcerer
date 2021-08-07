import { readFileSync } from "fs";
import glob from "glob";
import { basename, join } from "path";
import { map, pipe, replace, toString } from "rambda";
import { anchorify } from "../anchor";
import { rustify } from "../rust";
import { parse } from "../typescript";

interface TestJSON {
  parsed: Record<string, any>;
  anchorized: Record<string, any>;
}

glob.sync(join(__dirname, "basic*/*.ts")).forEach((tsFilePath) => {
  describe(basename(tsFilePath), () => {
    const json: Array<TestJSON> = pipe(
      replace(".ts", ".json"),
      readFileSync,
      toString,
      JSON.parse
    )(tsFilePath);

    test("parse", () => {
      expect(parsed(tsFilePath)).toEqual(json.map((x: any) => x.parsed));
    });

    test("anchorify", () => {
      expect(anchorified(tsFilePath)).toEqual(
        json.map((x: any) => x.anchorized)
      );
    });

    test("rustify", () => {
      expect(rustified(tsFilePath)).toEqual(
        json.map((x) => {
          const filename = tsFilePath.replace(
            basename(tsFilePath),
            `${x.anchorized.name}.rs`
          );
          return pipe(readFileSync, toString, stripWhitespace)(filename);
        })
      );
    });
  });
});

const parsed = pipe(readFileSync, toString, parse);
const anchorified = pipe(parsed, anchorify);

const stripWhitespace = (body: string) => body.replace(/\s/g, "");
const rustified = pipe(
  anchorified,
  rustify,
  map((x) => stripWhitespace(x.code))
);
