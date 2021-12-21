/* tslint:disable */
/* eslint-disable */
/**
*/
export function greet(): void;
/**
* @param {string} s
* @returns {Uint8Array | undefined}
*/
export function compress(s: string): Uint8Array | undefined;
/**
* @param {string} s
* @returns {Uint8Array | undefined}
*/
export function compress_with_lzma2(s: string): Uint8Array | undefined;
/**
* @param {Uint8Array} input
* @param {number} size
* @returns {string | undefined}
*/
export function into_svg(input: Uint8Array, size: number): string | undefined;
/**
* @param {Uint8Array} bytes
* @returns {string | undefined}
*/
export function inflate(bytes: Uint8Array): string | undefined;
/**
*/
export function foo(): void;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly greet: () => void;
  readonly compress: (a: number, b: number, c: number) => void;
  readonly compress_with_lzma2: (a: number, b: number, c: number) => void;
  readonly into_svg: (a: number, b: number, c: number, d: number) => void;
  readonly inflate: (a: number, b: number, c: number) => void;
  readonly foo: () => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number) => number;
  readonly __wbindgen_free: (a: number, b: number) => void;
}

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
