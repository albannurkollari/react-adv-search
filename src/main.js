// Libraries
import React from "react";
import ReactDOM from "react-dom";

// Helpers
import * as serviceWorker from "./serviceWorker";

// Stylesheet(s)
import "./main.css";

// Components
import Search from "./components/Search";

// Helpers
import {getAllCountries} from './api';

// Constants
import {CLS, PEOPLE} from "./constants";

// Start the app
(async () => {
  const countries = /^yes$/i.test(localStorage.countries) ? await getAllCountries() : [];
  const possibilities = [...PEOPLE, ...countries];
  const root = document.createElement('div');
  root.className = CLS.ROOT;

  ReactDOM.render(
    <div className={CLS.APP_MAIN}>
      <Search possibilities={possibilities} />
    </div>,
    document.body.insertBefore(root, document.body.firstChild)
  );
})();

serviceWorker.unregister();
