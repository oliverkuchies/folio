"use strict";
(() => {
  // test.ts
  document.querySelector("#increment").addEventListener("click", () => {
    const counter = document.querySelector("#number");
    if (!counter) {
      throw new Error("Could not find valid counter div");
    }
    const newValue = Number(counter.innerHTML) + 1;
    if (newValue == 5) {
      throw new Error("I don't like 5");
    }
    counter.innerHTML = newValue.toString();
  });
})();
//# sourceMappingURL=test.js.map
