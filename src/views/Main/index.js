// Libraries
import React from "react";
import ReactDOM from "react-dom";

// Helpers
import * as serviceWorker from "../../serviceWorker";

// Components
import Search from "../../components/Search";
import Trademark from "../../components/Trademark";

// Images
import * as Icons from "../../assets/img";

// Helpers
import {getAllCountries} from '../../api';

// Constants
import {PEOPLE} from "../../constants";

// Stylesheet(s)
import "./styles.css";

// Start the app
(async () => {
  const countries = await getAllCountries();
  const root = document.createElement('div');
  root.className = 'root';

  ReactDOM.render(
    <>
      <header>
        <h2>React Advanced Search</h2>
      </header>
      <main>
        <h3>So...how does it work?</h3>
        <nav style={{ marginBottom: "10px" }}>
          <div className="step">
            1. Click the{" "}
            <Icons.Search style={{ margin: "0 4px" }} width={16} height={16} />{" "}
            to start searching.
          </div>
          <div className="step">
            2. Once the search bar appears start searching for any desired
            country.
            <i style={{ fontSize: "10px" }}>
              (disclaimer: the country data is provided by a public API)
            </i>
          </div>
          <div className="step">
            3. If your search yielded results, you can then start navigating
            with
            <b> up</b>, <b>down</b>, <b>Home</b> and <b>End</b> keys.
          </div>
          <div className="step">
            4. You can aswell <b>pin/unpin</b> the options list by clicking on
            <Icons.Pin style={{ margin: "0 4px" }} width={16} height={16} />.
          </div>
          <div className="step">
            5. If you press <b>Esc</b> once, it will close the results panel.
            Pressing <b>Esc</b> for the 2nd time clears the search completely!
          </div>
        </nav>
        <Search
          detached={Boolean(localStorage.searchDetached)}
          rowsVisible={
            localStorage.searchRows && Number(localStorage.searchRows)
          }
          possibilities={Array.isArray(countries) ? countries : PEOPLE}
        />
      </main>
      <footer>
        <Trademark>
          {/* FLATICON.COM BADGE */}
          <div>
            {"Icons made by "}
            <a href="https://www.flaticon.com/authors/freepik" title="Freepik">
              Freepik
            </a>
            {" from "}
            <a href="https://www.flaticon.com/" title="Flaticon">
              www.flaticon.com
            </a>
          </div>
        </Trademark>
      </footer>
    </>,
    document.body.insertBefore(root, document.body.firstChild)
  );
})();

serviceWorker.unregister();
