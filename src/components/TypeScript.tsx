import Editor, { BeforeMount, OnMount } from "@monaco-editor/react";
import React, { useEffect, useMemo } from "react";
import Worker from "../lib/parse/worker.ts?worker";

// @anchor
const defaultValue = `// class Basic0 {
//   initialize() {}
// }

// class Basic1 {
//   myAccount: {
//     data: u64
//   }
//   @init("myAccount")
//   initialize(data:u64) {
//     this.myAccount.data = data;
//   }
//   update(data:u64) {
//     this.myAccount.data = data;
//   }
// }

class Basic2 {
  counter: {
    count: u64;
    authority: pubKey;
  }
  @init("counter")
  create(authority:pubKey) {
    this.counter.count = 0;
    this.counter.authority = authority;
  }
  @signer("authority")
  @mut("counter", { hasOne: "authority" })
  update(data:u64) {
    this.counter.count += 1;
  }
}`;

function TypeScript({ setRust }: { setRust: any }) {
  const worker = useMemo(() => new Worker(), []);
  useEffect(() => {
    const handleMessage = ({ data }: any) => {
      setRust(data);
    };
    worker.addEventListener("message", handleMessage);
    worker.postMessage(defaultValue);
    return () => {
      worker.removeEventListener("message", handleMessage);
    };
  }, [setRust]);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);

    import("monaco-themes/themes/Tomorrow-Night-Bright.json").then((data) => {
      monaco.editor.defineTheme("theme", data);
      monaco.editor.setTheme("theme");
    });
  };

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    });
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      ...monaco.languages.typescript.javascriptDefaults.getCompilerOptions(),
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      type u8 = number;
      type u16 = number;
      type u32 = number;
      type u64 = number;
      type u128 = number;
      type usize = number;

      type i8 = number;
      type i16 = number;
      type i32 = number;
      type i64 = number;
      type i128 = number;
      type isize = number;

      type pubKey = number;
      `,
      "types.d.ts"
    );

    monaco.languages.typescript.typescriptDefaults.addExtraLib(
      `
      type ProtoOf<T> = Pick<T, keyof T>;

      /**
       * Initializes the account
       * @param accountName
       */
      function init<CK extends string>(accountName: CK) {
        //return function<T extends Base & {[P in CK]: G}> (
        //  target: any,
        //  propertyKey: string,
        //  descriptor: PropertyDescriptor
        //) {
        //};

        return <
          T extends Base & {[P in CK]: G},
          K extends keyof T,
          F extends T[K] & G,
          R>(
            proto: ProtoOf<T> & {[P in CK]: Record<string,unknown>},
            propertyKey: K,
            descriptor: TypedPropertyDescriptor<F>) => {
          // Do stuff.
        };
      }

      /**
       * Specify the signer account for the instruction
       * @param accountName
       */
       function signer(accountName: string) {
        return function (
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
        };
      }
      // function signer<CK extends string>(accountName: CK) {
      //   return <
      //     T extends Base & {[P in CK]: G},
      //     K extends keyof T,
      //     F extends T[K] & G,
      //     R>(
      //       proto: ProtoOf<T> & {[P in CK]: pubKey},
      //       propertyKey: K,
      //       descriptor: TypedPropertyDescriptor<F>) => {
      //     // Do stuff.
      //   };
      // }

      /**
       * Makes an account mutable
       * @param accountName
       * @param opts
       */
      interface MutOpts {
        hasOne?: string
      }
      function mut(accountName: keyof this, opts?: MutOpts = {}) {
        return function (
          target: any,
          propertyKey: string,
          descriptor: PropertyDescriptor
        ) {
        };
      }
      `
    );
  };

  return (
    <Editor
      beforeMount={handleEditorWillMount}
      onChange={(value) => {
        if (value) worker.postMessage(value);
      }}
      onMount={handleEditorDidMount}
      options={{
        padding: {
          top: 20,
          bottom: 20,
        },
        lineNumbers: "off",
        renderLineHighlight: "none",
        fontFamily: "JetBrains Mono",
        fontLigatures: true,
        fontWeight: "400",
        lineHeight: 28,
        fontSize: 19,
        scrollBeyondLastLine: false,
        scrollbar: { vertical: "auto" },
        minimap: { enabled: false },
      }}
      theme="vs-dark"
      defaultLanguage="typescript"
      defaultValue={defaultValue}
    />
  );
}

export default TypeScript;
