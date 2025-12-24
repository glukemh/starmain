/** @import { MainGenObj } from '../src/types.js' */
import { start, linkNext } from "../src/index.js";

/** @implements MainGenObj */
class Example extends HTMLElement {
  button = document.createElement("button");

  connectedCallback() {
    start(this);
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event("disconnected"));
  }

  *main() {
    using s = new DisposableStack();
    const controller = s.adopt(new AbortController(), (c) => c.abort());
    const [next, gen] = linkNext();

    this.append(this.button);
    this.addEventListener("disconnected", next, controller);
    this.button.addEventListener("click", next, controller);

    let count = 0;
    while (this.isConnected) {
      this.button.textContent = `Count: ${count++}`;
      yield* gen();
    }
  }
}

customElements.define("my-element", Example);
