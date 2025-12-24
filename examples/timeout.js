/** @import { MainGenObj } from '../src/index.js' */
import { start, cb, linkNext } from "../src/index.js";

/** @implements MainGenObj */
class Example {
  state = new State();

  constructor() {
    start(this);
  }

  *main() {
    while (!this.state.connected) {
      yield* cb((next) => {
        this.state.on("connected", next, { once: true });
      });
    }
    return this.other();
  }

  *other() {
    using disposable = new DisposableStack();
    const controller = disposable.adopt(new AbortController(), (c) =>
      c.abort(),
    );
    const [next, gen] = /** @type {typeof linkNext<string> } */ (linkNext)();
    this.state.on("connected", () => next("connected"), controller);
    this.state.on("message", () => next("message"), controller);

    while (this.state.connected) {
      const change = yield* gen();

      if (change === "message") {
        console.log(this.state.message);
      }
    }
    console.log("done");
  }
}

class State {
  #target = new EventTarget();
  connected = false;
  message = "Hello, world!";

  /**
   * @template {Exclude<keyof this & string, 'on' | 'set'>} K
   * @param {K} prop
   * @param {this[K]} value
   */
  set(prop, value) {
    this[prop] = value;
    this.#target.dispatchEvent(new Event(prop));
  }

  /**
   * @template {Exclude<keyof this & string, 'on' | 'set'>} K
   * @param {K} prop
   * @param {(newValue: this[K]) => void} listener
   * @param {AddEventListenerOptions} [options]
   */
  on(prop, listener, options) {
    this.#target.addEventListener(prop, () => listener(this[prop]), options);
  }
}

const ex = new Example();
ex.state.set("connected", true);
setTimeout(() => {
  ex.state.set("message", "New message received!");
}, 1000);
setTimeout(() => {
  ex.state.set("connected", false);
}, 2000);
