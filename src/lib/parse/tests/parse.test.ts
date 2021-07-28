import { readFileSync } from "fs";
import glob from "glob";
import { basename } from "path";
import { map, pipe, replace, toString } from "rambda";
import parse from "../parse";
// import anchorize from "../anchorize";
// import rustify from "../rustify";

const parsed = pipe(replace(".rs", ".ts"), readFileSync, toString, parse);
// const anchorized = pipe(parsed, anchorize)
// const rustified = pipe(parsed, rustify, trim)

glob
  .sync("src/**/*.rs")
  .slice(0, 1)
  .forEach((rustFilePath) => {
    test(basename(rustFilePath), () => {
      console.log(parsed(rustFilePath));
      expect(parsed(rustFilePath)).toEqual(
        pipe(
          replace(".rs", ".json"),
          readFileSync,
          toString,
          JSON.parse,
          map((x: any) => x.parsed)
        )(rustFilePath)
      );

      // expect(
      //   parsed(rustFilePath)
      // ).toEqual(pipe(readFileSync, toString, trim)(rustFilePath));

      // expect(
      //   anchorized(rustFilePath)
      // ).toEqual(pipe(readFileSync, toString, trim)(rustFilePath));

      // expect(
      //   rustified(rustFilePath)
      // ).toEqual(pipe(readFileSync, toString, trim)(rustFilePath));
    });
  });

// function trim(body: string) {
//   return body.replace(/\s/g, "");
// }
