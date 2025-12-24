/** @import { MainGenObj } from '../src/types.js' */

import { start, linkNext } from "../src/index.js";

/** @implements MainGenObj */
class Example {
  target = new EventTarget();

  constructor() {
    start(this);
  }

  *main() {
    using disposable = new DisposableStack();
    const controller = disposable.adopt(new AbortController(), (c) =>
      c.abort(),
    );
    const [next, gen] = /** @type {typeof linkNext<Event> } */ (linkNext)();
    this.target.addEventListener("message", next, controller);
    this.target.addEventListener("done", next, controller);

    let done = false;
    while (!done) {
      const event = yield* gen();
      done = event.type === "done";
      if (event.type === "message" && event instanceof CustomEvent) {
        console.log(event.detail);
      }
    }
    console.log("done");
  }
}

const ex = new Example();
setTimeout(() => {
  ex.target.dispatchEvent(
    new CustomEvent("message", { detail: "Hello, world!" }),
  );
}, 1000);
setTimeout(() => {
  ex.target.dispatchEvent(new Event("done"));
}, 2000);
