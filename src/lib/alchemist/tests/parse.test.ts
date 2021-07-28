import { readFileSync } from "fs";
import glob from "glob";
import { basename } from "path";
import { pipe, replace, toString } from "rambda";
import anchorize from "../anchorize";
import parse from "../parse";
import rustify from "../rustify";

glob
  .sync("src/**/*.rs")
  .slice(0, 1)
  .forEach((rustFilePath) => {
    test(basename(rustFilePath), () => {
      const json = pipe(
        replace(".rs", ".json"),
        readFileSync,
        toString,
        JSON.parse
      )(rustFilePath);

      expect(parsed(rustFilePath)).toEqual(json.map((x: any) => x.parsed));

      expect(anchorized(rustFilePath)).toEqual(
        json.map((x: any) => x.anchorized)
      );

      expect(rustified(rustFilePath)).toEqual(
        pipe(readFileSync, toString, stripWhitespace)(rustFilePath)
      );
    });
  });

const stripWhitespace = (body: string) => body.replace(/\s/g, "");

const parsed = pipe(replace(".rs", ".ts"), readFileSync, toString, parse);
const anchorized = pipe(parsed, anchorize);
const rustified = pipe(anchorized, rustify, stripWhitespace);
