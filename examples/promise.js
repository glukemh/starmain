/** @import { MainGenObj } from '../src/index.js' */
import { start, settled } from "../src/index.js";

/** @implements MainGenObj */
class Example {
  constructor() {
    start(this);
  }

  *main() {
    const message = yield* settled(Promise.resolve("Hello, world!"));
    console.log(message);
  }
}

new Example();
