import { start, settled } from "../src/index.js";

class Example {
  constructor() {
    start(this);
  }

  *main() {
    const message = yield* settled(Promise.resolve("Hello, world!"));
    if (message.status === "rejected") {
      throw new Error("Promise was rejected");
    }
    console.log(message.value);
  }
}

new Example();
