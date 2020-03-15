// Libraries
import React from "react";
import ReactDOM from "react-dom";

// Helpers
import * as serviceWorker from "../../serviceWorker";

// Components
import Search from "../../components/Search";
import Trademark from "../../components/Trademark";

// Helpers
import {getAllCountries} from '../../api';

// Constants
import {CLS, PEOPLE} from "../../constants";

// Stylesheet(s)
import "./styles.css";

// Start the app
(async () => {
  const countries = await getAllCountries();
  const root = document.createElement('div');
  root.className = CLS.ROOT;

  ReactDOM.render(
    <>
      <header>React Advanced Search</header>
      <main>
        <Search rowsVisible={8} possibilities={Array.isArray(countries) ? countries : PEOPLE} />
      </main>
      <footer>
        <Trademark>
          {/* FLATICON.COM BADGE */}
          <div>
            {"Icons made by "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a>
            {" from "}
            <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a>
          </div>
        </Trademark>
      </footer>
    </>,
    document.body.insertBefore(root, document.body.firstChild)
  );
})();

serviceWorker.unregister();
