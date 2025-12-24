/**
 * Top level generator
 * @typedef {Generator<((next: (value: unknown) => void) => void), MainGen | void>} MainGen
 */
/**
 * Sub generator that may have a return value
 * @template [T=void]
 * @typedef {Generator<((next: (value: unknown) => void) => void), T>} SubGen
 */
/**
 * Function returning a top level generator
 * @callback MainGenFunc
 * @returns {MainGen}
 */
/**
 * Object implementing a main generator function
 * @typedef MainGenObj
 * @prop {MainGenFunc} main Entry point
 */
/**
 * Next function to resume the generator
 * @template [T=void]
 * @typedef {[T] extends [void] ? (() => void) : (value: T) => void} Next
 */
/**
 * Callback invoked immediately with a next function
 * @template [T=void]
 * @callback NextCallback
 * @param {Next<T>} next call next to resume the generator
 */

export {};
