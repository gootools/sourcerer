export {};

declare global {
  interface Window {
    wasm_bindgen: any;
    // wasm_bindgen: {
    //   rustfmt: (code: string) => {
    //     free(): void;
    //     code(): string;
    //     error(): string;
    //   };
    // };
    replaceHash: (newhash: string) => void;
  }
}
