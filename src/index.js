import polyfills from "./polyfills";

Promise.all(
  polyfills.concat([import(/* webkpackChunkName: "main" */ "./views/Main")])
);
