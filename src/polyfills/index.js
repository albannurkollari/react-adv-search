// eslint-disable-next-line no-unused-expressions
!(function(agent) {
  var version = parseFloat(
    (agent.match(/trident\/((\d+)(\.\d+)?)/i) || ["0", "0"])[1]
  );

  window.isIE11 = version >= 7;
})(window.navigator.userAgent);

var polyfills = [];

if (window.isIE11) {
  polyfills = polyfills.concat([
    (require("react-app-polyfill/stable"),
    require("react-app-polyfill/ie11"),
    import(/* webkpackChunkName: "polyfillsDOM" */ "./DOM"),
    import(/* webkpackChunkName: "polyfillsCSS" */ "ie11-custom-properties"))
  ]);
}

export default polyfills;
