// Libraries
import PropTypes from "prop-types";
import React from "react";

// Helpers
import {classes} from "../../utils";
import {useSearch} from '../../hooks';

// Stylesheets(s)
import "./styles.css";

// Images
import {
  IconSearch,
  IconSearchFound,
  IconMenu,
  IconMenuOpen
} from "../../assets/img";

// Constants
import {CLS, LABELS} from '../../constants';

const Search = ({
  labels: {iconTooltip, pinTooltip, searchPlaceholder},
  possibilities,
  toggleList,
  onCallback
}) => {
  const {
    hasFoundSome,
    inputSearchRef,
    searchRowRef,
    filtered,
    menuIsToggled,
    setMenuIsToggled,
    onSearchKeydown,
    onSearch,
    onSearchFocus
  } = useSearch(possibilities, onCallback);

  return (
    <div
      className={classes.get({
        [CLS.SEARCH_BOX]: true,
        [CLS.SEARCH_BOX_WITH_PIN]: toggleList
      })}
      style={{"--maxRowsVisible": 5}}
    >
      {possibilities.length && (
        <>
          {/* SEARCH_ROW */}
          <div ref={searchRowRef} className="search-row">
            <div
              className={CLS.SEARCH_ICON}
              title={iconTooltip}
              onClick={onSearchFocus}
            >
              {hasFoundSome ? <IconSearchFound /> : <IconSearch />}
            </div>
            <input
              ref={inputSearchRef}
              alt="search"
              placeholder={searchPlaceholder}
              onFocus={onSearchFocus}
              onChange={onSearch}
              onKeyDown={onSearchKeydown}
            />
            <span className={CLS.SEARCH_ROW_BORDERS} />
          </div>
          {/* SEARCH_LIST_PINNER */}
          {toggleList && (
            <div
              className={CLS.SEARCH_PINNER}
              title={pinTooltip}
              onClick={() => setMenuIsToggled(!menuIsToggled)}
            >
              {menuIsToggled ? <IconMenuOpen /> : <IconMenu />}
            </div>
          )}
          {/* SEARCH_LIST */}
          <div
            className={classes.get({
              [CLS.SEARCH_LIST]: true,
              [CLS.SEARCH_LIST_NONE_FOUND]: !possibilities.length
            })}
          >
            {filtered.map(({key, value, content = false, isLast = false}) => {
              return (
                <div
                  key={key}
                  className={classes.get({
                    [CLS.ITEM]: true,
                    [CLS.FOUND]: menuIsToggled || content,
                    [CLS.NO_BORDER]: isLast
                  })}
                >
                  <label className={CLS.SEARCH_TEXT}>{content || value}</label>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
Search.propTypes = {
  labels: PropTypes.shape({
    iconTooltip: PropTypes.string,
    searchPlaceholder: PropTypes.string,
    pinTooltip: PropTypes.string
  }),
  possibilities: PropTypes.array.isRequired,
  toggleList: PropTypes.bool,
  onCallback: PropTypes.func
};
Search.defaultProps = {
  labels: {
    iconTooltip: LABELS.TOOLTIPS.ICON,
    searchPlaceholder: LABELS.PLACEHOLDERS.SEARCH,
    pinTooltip: LABELS.TOOLTIPS.PIN
  },
  toggleList: true,
  onCallback: undefined
};

export default Search;
