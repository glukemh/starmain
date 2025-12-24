/** @import { MainGen, MainGenFunc, MainGenObj, SubGen, Next, NextCallback } from './types.js' */

/**
 * Call the main generator function and start execution
 * @param {MainGenObj | MainGenFunc | MainGen} mainGen Entry point
 * @returns {MainGen} The running main generator
 */
export function start(mainGen) {
  let iter = mainGen;
  if (typeof iter === "function") {
    iter = iter();
  } else if ("main" in iter) {
    iter = iter.main();
  }
  handleNext(iter);
  return iter;
}

/**
 * Yields a promise settled result
 * @template {Promise} T
 * @param {T} promise
 * @returns {SubGen<PromiseSettledResult<Awaited<T>>>}
 */
export function* settled(promise) {
  return yield* cb((next) =>
    Promise.allSettled([promise]).then(([v]) => next(v)),
  );
}

/**
 * Resolves a promise and yields the result
 * @template {Promise} T
 * @param {T} promise
 * @returns {SubGen<Awaited<T>>}
 */
export function* unwrap(promise) {
  const v = yield* settled(promise);
  if (v.status === "rejected") throw v.reason;
  return v.value;
}

/**
 * Creates a callback-based yield point
 * @template [T=void]
 * @param {NextCallback<T>} callback function invoked immediately with a next function
 * @returns {SubGen<T>}
 */
export function* cb(callback) {
  return yield callback;
}

/**
 * Creates a linked pair of next function and sub-generator
 * @template [T=void]
 * @returns {[Next<T>, () => SubGen<T>]}
 */
export function linkNext() {
  /** @type {Next<T>} */
  let next = () => {};
  return [/** @type {Next<T>} */ ((x) => next(x)), () => cb((n) => (next = n))];
}

/** @param {MainGen} gen @param {unknown} [nextValue] */
function handleNext(gen, nextValue) {
  const next = gen.next(nextValue);

  if (next.done !== true) next.value((value) => handleNext(gen, value));
  else if (next.value) handleNext(next.value);
}
