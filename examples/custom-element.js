/** @import { MainGenObj } from '../src/index.js' */
import { start, nextCb } from "../src/index.js";

/** @implements MainGenObj */
class Example extends HTMLElement {
  button = document.createElement("button");
  removeButton = document.createElement("button");

  connectedCallback() {
    start(this);
  }

  disconnectedCallback() {
    this.dispatchEvent(new Event("disconnected"));
  }

  *main() {
    using s = new DisposableStack();
    const controller = s.adopt(new AbortController(), (c) => c.abort());
    const [next, cb] = nextCb();

    this.append(this.button, this.removeButton);
    this.removeButton.textContent = "Remove me";
    this.removeButton.addEventListener(
      "click",
      () => this.remove(),
      controller,
    );
    this.addEventListener("disconnected", next, controller);
    this.button.addEventListener("click", next, controller);

    let count = 0;
    while (this.isConnected) {
      this.button.textContent = `Count: ${count++}`;
      yield* cb();
    }

    console.log("disconnected");
  }
}

customElements.define("my-element", Example);
