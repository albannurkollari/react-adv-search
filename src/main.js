// Libraries
import React from "react";
import ReactDOM from "react-dom";

// Helpers
import * as serviceWorker from "./serviceWorker";

// Stylesheet(s)
import "./main.css";

// Components
import Search from "./components/Search";

const possibilities = [
  {
    key: "bani",
    value: "Alban Nurkollari"
  },
  {
    key: "dona",
    value: "Edona Rexhaj-Nurkollari"
  },
  {
    key: "aro",
    value: "Arjeta Nurkollari"
  },
  {
    key: "bes",
    value: "Besnik Nurkollari"
  },
  {
    key: "edi",
    value: "Edina Nurkollari-Bytyqi"
  },
  {
    key: "beta",
    value: "Bejtulla Bytyqi"
  },
  {
    key: "roki",
    value: "Roar Bytyqi"
  },
  {
    key: "nik",
    value: "Niklas Gullberg"
  },
  {
    key: "nelly",
    value: "Nelly"
  }
];

ReactDOM.render(
  <div className="App">
    <Search possibilities={possibilities} />
  </div>,
  document.getElementById("root")
);

serviceWorker.unregister();
