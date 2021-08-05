export {};

declare global {
  interface Window {
    wasm_bindgen: any;
    replaceHash: (newhash: string) => void;
  }
}
