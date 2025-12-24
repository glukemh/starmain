/** @import { MainGenObj } from '../src/types.js' */
import { start, settled, unwrap } from "../src/index.js";

/** @implements MainGenObj */
class Example {
  constructor() {
    start(this);
  }

  *main() {
    try {
      const message1 = yield* settled(Promise.resolve("message settled"));
      const message2 = yield* unwrap(Promise.resolve("message unwrapped"));
      console.log(message1);
      console.log(message2);
    } catch (e) {
      console.error("Caught error:", e);
    }
  }
}

new Example();
