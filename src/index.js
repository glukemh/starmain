/** @param {MainGenObj | MainGenFunc | MainGen} obj */
export function start(obj) {
  let iter = obj;
  if (typeof iter === "function") {
    iter = iter();
  } else if ("main" in iter) {
    iter = iter.main();
  }
  handleNext(iter);
  return iter;
}

/**
 * @template {Promise} T
 * @param {T} value
 * @returns {SubGen<PromiseSettledResult<Awaited<T>>>}
 */
export function* settled(value) {
  return yield* cb((next) =>
    Promise.allSettled([value]).then(([v]) => next(v)),
  );
}

/**
 * @template {Promise} T
 * @param {T} value
 * @returns {SubGen<Awaited<T>>}
 */
export function* unwrap(value) {
  return yield* cb((next) => value.then(next));
}

/**
 * @template [T=void]
 * @param {(next: [T] extends [void] ? (() => void) : (value: T) => void) => void} f
 * @returns {SubGen<T>}
 */
export function* cb(f) {
  return yield f;
}

/**
 * @template [T=void]
 */
export function nextCb() {
  /** @type {[T] extends [void] ? (() => void) : (value: T) => void} */
  let next = () => {};
  return /** @type {const} */ ([
    /** @type {typeof next} */ ((x) => next(x)),
    () =>
      /** @type {typeof cb<T>} */ (cb)((n) => {
        next = n;
      }),
  ]);
}

/** @param {MainGen} gen @param {unknown} [nextValue] */
function handleNext(gen, nextValue) {
  const next = gen.next(nextValue);
  if (next.done === true) {
    if (next.value) {
      handleNext(next.value);
    }
    return;
  }

  next.value((value) => handleNext(gen, value));
}

/**
 * @typedef {Generator<((next: (value: unknown) => void) => void), MainGen | void>} MainGen
 */
/**
 * @template [T=void]
 * @typedef {Generator<((next: (value: unknown) => void) => void), T>} SubGen
 */
/**
 * @callback MainGenFunc
 * @returns {MainGen}
 */
/**
 * @typedef MainGenObj
 * @prop {MainGenFunc} main
 */
