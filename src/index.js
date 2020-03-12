import polyfills from "./polyfills";

console.log(polyfills);

Promise.all(
  polyfills.concat([import(/* webkpackChunkName: "main" */ "./main")])
);
