// Libraries
import PropTypes from "prop-types";
import React, { useState, useCallback, useRef } from "react";

// Helpers
import { getClasses } from "../../utils/DOM";

// Stylesheets(s)
import "./styles.css";

// Images
import { ReactComponent as IconSearch } from "../../assets/img/search_default.svg";
import { ReactComponent as IconSearchFound } from "../../assets/img/search_found.svg";
import { ReactComponent as IconMenu } from "../../assets/img/menu_default.svg";
import { ReactComponent as IconMenuOpen } from "../../assets/img/menu_open.svg";

const SEARCH_BOX_WRAPPER_CLASS = "search-list";
const SEARCH_BOX_ID = "search";
const SEARCH_BOX_MENU_MAX_SHOWN_ITEMS = 5;
const ITEM_CLS = "item";
const FOUND_CLS = "found";
const TEXT_CLS = "text";
const NO_BORDER_CLS = "no-border";
const FOCUSED_CLS = "focused";
const SEARCH_ICON_CLS = "search-icon";

const Bani = ({
  labels: { iconTooltip, pinTooltip, searchPlaceholder },
  possibilities,
  toggleList,
  onCallback
}) => {
  const inputSearchRef = useRef();
  const searchRowRef = useRef();
  const [filtered, setFiltered] = useState(possibilities);
  const [menuIsToggled, setMenuIsToggled] = useState(false);
  const toggleSearchVisibility = useCallback(({ show } = {}) => {
    const method = show ? "add" : "remove";

    // eslint-disable-next-line no-unused-expressions
    searchRowRef?.current.classList[method]?.(FOCUSED_CLS, show);
  }, []);
  const onSearchKeydown = useCallback(
    ({ keyCode, target }) => {
      if (keyCode === 27) {
        if (target.value.trim() !== "") {
          target.value = "";
        } else {
          toggleSearchVisibility({ show: false });
        }

        setFiltered(possibilities);
      }
    },
    [possibilities, setFiltered, toggleSearchVisibility]
  );
  const onSearch = useCallback(
    ({ target: { value: searchText } }) => {
      if (searchText.trim() === "") {
        return setFiltered(possibilities);
      }

      let items = possibilities.map(({ value, ...rest }) => {
        const regex = new RegExp(`(${searchText})`, "gi");

        if (regex.test(value)) {
          const content = value
            .replace(regex, "*$1*")
            .split("*")
            .map((item, i) =>
              regex.test(item) ? <b key={`b-${i}`}>{item}</b> : item
            )
            .filter(Boolean);

          return { ...rest, value, content };
        }

        return { ...rest, value };
      });

      if (!menuIsToggled) {
        items = items.filter(({ content }) => content);
      }

      items = items.map((item, i, { length }) => ({
        ...item,
        isLast: i === length - 1
      }));

      setFiltered(items);
    },
    [possibilities, menuIsToggled]
  );
  const onSearchFocus = useCallback(
    ({ target }) => {
      const isFocused = searchRowRef?.current.classList.contains(FOCUSED_CLS);
      const iconTriggeredEvent = Boolean(target.closest(`.${SEARCH_ICON_CLS}`));

      iconTriggeredEvent
        ? toggleSearchVisibility({ show: !isFocused })
        : toggleSearchVisibility({ show: true });

      if (!isFocused && iconTriggeredEvent) {
        // eslint-disable-next-line no-unused-expressions
        inputSearchRef?.current.focus();
      }
    },
    [toggleSearchVisibility]
  );

  const hasFoundSome = filtered.some(({ content }) => content);

  return (
    <div
      className={getClasses({
        "search-box__wrapper": true,
        "with-pin": toggleList
      })}
      style={{ "--maxRowsVisible": SEARCH_BOX_MENU_MAX_SHOWN_ITEMS }}
    >
      {possibilities.length && (
        <>
          <div ref={searchRowRef} className="search-row">
            <div
              className="search-icon"
              title={iconTooltip}
              onClick={onSearchFocus}
            >
              {hasFoundSome ? <IconSearchFound /> : <IconSearch />}
            </div>
            <input
              ref={inputSearchRef}
              id={SEARCH_BOX_ID}
              alt="search-box"
              placeholder={searchPlaceholder}
              onFocus={onSearchFocus}
              onChange={onSearch}
              onKeyDown={onSearchKeydown}
            />
            <span className="borders" />
            {/* <span className="borders" /> */}
          </div>
          {toggleList && (
            <div
              className="pin-search-list"
              title={pinTooltip}
              onClick={() => setMenuIsToggled(!menuIsToggled)}
            >
              {menuIsToggled ? <IconMenuOpen /> : <IconMenu />}
            </div>
          )}
          <div
            className={getClasses({
              [SEARCH_BOX_WRAPPER_CLASS]: true,
              "no-options": !possibilities.length
            })}
          >
            {filtered.map(({ key, value, content = false, isLast = false }) => {
              return (
                <div
                  key={key}
                  className={getClasses({
                    [ITEM_CLS]: true,
                    [FOUND_CLS]: menuIsToggled || content,
                    [NO_BORDER_CLS]: isLast
                  })}
                >
                  <label className={TEXT_CLS}>{content || value}</label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
Bani.propTypes = {
  labels: PropTypes.shape({
    iconTooltip: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    pinTooltip: PropTypes.string
  }),
  possibilities: PropTypes.array.isRequired,
  toggleList: PropTypes.bool,
  onCallback: PropTypes.func
};
Bani.defaultProps = {
  labels: {
    iconTooltip: "Click here to start search",
    searchPlaceholder: "Search here",
    pinTooltip: "Click to pin/unpin the list"
  },
  toggleList: true,
  onCallback: undefined
};

export default Bani;
