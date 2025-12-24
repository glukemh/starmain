/** @import { MainGenObj } from '../src/types.js' */
import { start, cb } from "../src/index.js";

/** @implements MainGenObj */
class Example {
  /** @type {State} */
  state = { tag: "a", value: "" };
  constructor() {
    start(this);
  }

  *main() {
    while (this.state.tag !== "done") {
      yield* this[this.state.tag]();
    }
    console.log(this.state.value);
  }

  *a() {
    while (this.state.tag === "a") {
      this.state.value += "a";
      yield* cb((next) => {
        const x = Math.random();
        if (x < 1 / 3) {
          this.state = { ...this.state, tag: "b" };
        } else if (x < 2 / 3) {
          this.state = { ...this.state, tag: "c" };
        }
        next();
      });
    }
  }

  *b() {
    while (this.state.tag === "b") {
      this.state.value += "b";
      yield* cb((next) => {
        this.state = { ...this.state, tag: "a" };
        next();
      });
    }
  }

  *c() {
    while (this.state.tag === "c") {
      this.state.value += "c";
      yield* cb((next) => {
        this.state = { ...this.state, tag: "done" };
        next();
      });
    }
  }
}

new Example();

/** @typedef {{ tag: 'a', value: string }} StateA */
/** @typedef {{ tag: 'b', value: string }} StateB */
/** @typedef {{ tag: 'c', value: string }} StateC */
/** @typedef {{ tag: 'done', value: string }} StateDone */
/** @typedef {StateA | StateB | StateC | StateDone} State */
