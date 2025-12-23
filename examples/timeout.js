import { start, cb } from "../src/index.js";

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
    yield* this.other(this.state);
    console.log("done");
  }

  /** @param {State} state */
  *other(state) {
    while (state.connected) {
      const change = yield* /** @type {typeof cb<string>} */ (cb)((next) => {
        this.state.on("connected", () => next("connected"), { once: true });
        this.state.on("message", () => next("message"), { once: true });
      });

      if (change === "message") {
        console.log(state.message);
      }
    }
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
setTimeout(() => {
  ex.state.set("connected", true);
}, 1000);
setTimeout(() => {
  ex.state.set("message", "New message received!");
}, 2000);
setTimeout(() => {
  ex.state.set("connected", false);
}, 3000);
