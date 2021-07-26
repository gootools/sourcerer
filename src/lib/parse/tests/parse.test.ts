import { readFileSync } from "fs";
import glob from "glob";
import { basename } from "path";
import { pipe, replace } from "rambda";
import parse from "../parse";
import rustify from "../rustify";

glob.sync("**/*.rs").forEach((rustFilePath) => {
  test(basename(rustFilePath), () => {
    expect(
      pipe(replace(".rs", ".ts"), openFile, parse, rustify, trim)(rustFilePath)
    ).toEqual(pipe(openFile, trim)(rustFilePath));
  });
});

function trim(body: string) {
  return body.replace(/\s/g, "");
}

function openFile(path: string) {
  return readFileSync(path).toString();
}
