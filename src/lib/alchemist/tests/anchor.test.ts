import { readFileSync } from "fs";
import glob from "glob";
import { basename, join } from "path";
import { pipe, replace, toString } from "rambda";
import { anchorify } from "../anchor";
import { rustify } from "../rust";
import { parse } from "../typescript";

glob.sync(join(__dirname, "basic*/*.ts")).forEach((tsFilePath) => {
  describe(basename(tsFilePath), () => {
    const json = pipe(
      replace(".ts", ".json"),
      readFileSync,
      toString,
      JSON.parse
    )(tsFilePath);

    const rustFilePath = replace(".ts", ".rs")(tsFilePath);

    test("parse", () => {
      expect(parsed(rustFilePath)).toEqual(json.map((x: any) => x.parsed));
    });

    test("anchorify", () => {
      expect(anchorified(rustFilePath)).toEqual(
        json.map((x: any) => x.anchorized)
      );
    });

    test("rustify", () => {
      expect(rustified(rustFilePath)).toEqual(
        pipe(readFileSync, toString, stripWhitespace)(rustFilePath)
      );
    });
  });
});

const stripWhitespace = (body: string) => body.replace(/\s/g, "");

const parsed = pipe(replace(".rs", ".ts"), readFileSync, toString, parse);
const anchorified = pipe(parsed, anchorify);
const rustified = pipe(anchorified, rustify, stripWhitespace);
