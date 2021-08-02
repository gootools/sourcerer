import { readFileSync } from "fs";
import glob from "glob";
import { basename } from "path";
import { pipe, replace, toString } from "rambda";
import { anchorify } from "../anchor";
import { rustify } from "../rust";
import { parse } from "../typescript";

glob.sync("src/**/*.rs").forEach((rustFilePath) => {
  describe(basename(rustFilePath), () => {
    const json = pipe(
      replace(".rs", ".json"),
      readFileSync,
      toString,
      JSON.parse
    )(rustFilePath);

    test("parse", () => {
      expect(parsed(rustFilePath)).toEqual(json.map((x: any) => x.parsed));
    });

    test("anchorify", () => {
      expect(anchorified(rustFilePath)).toEqual(
        json.map((x: any) => x.anchorized)
      );
    });

    test("rustify", () => {
      // console.log(pipe(anchorified, rustify)(rustFilePath));
      // console.log(pipe(readFileSync, toString)(rustFilePath));
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
