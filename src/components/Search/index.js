/* eslint-disable no-unused-expressions */
// Libraries
import PropTypes from "prop-types";
import React, {useEffect} from "react";

// Helpers
import {classes} from "../../utils";
import {useSearch} from '../../hooks';

// Components
import BoldText from '../BoldText';

// Stylesheets(s)
import "./styles.css";

// Images
import * as Icons from "../../assets/img";

// Constants
import {CLS, LABELS} from '../../constants';

const Search = ({
  labels: {iconTooltip, pinTooltip, searchPlaceholder, found, notFound},
  possibilities,
  rowsVisible,
  toggleList,
  onCallback
}) => {
  const {
    isClean,
    hasFoundSome,
    inputSearchRef,
    searchRowRef,
    searchListRef,
    filtered,
    menuIsPinned,
    onPinnClick,
    onSearchKeydown,
    onSearch,
    onSearchClick,
    onSearchBlur,
    onItemSelect
  } = useSearch(possibilities, onCallback);

  useEffect(() => {
    document.documentElement.style.setProperty('--maxRowsVisible', rowsVisible);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={classes.get({
        [CLS.SEARCH_BOX]: true,
        [CLS.SEARCH_BOX_WITH_PIN]: toggleList
      })}
    >
      {possibilities.length && (
        <>
          {/* SEARCH_ROW */}
          <div ref={searchRowRef} className={CLS.SEARCH_ROW}>
            <div
              className={CLS.SEARCH_ICON}
              title={iconTooltip}
              onClick={onSearchClick}
            >
              {hasFoundSome ? <Icons.SearchFound /> : <Icons.Search />}
            </div>
            <input
              ref={inputSearchRef}
              alt="search"
              placeholder={searchPlaceholder}
              spellCheck={false}
              /* onBlur={onSearchBlur} */
              onChange={onSearch}
              onKeyDown={onSearchKeydown}
            />
            <span className={CLS.SEARCH_ROW_BORDERS} />
          </div>
          {/* SEARCH_LIST_PINNER */}
          <div
            className={CLS.SEARCH_PINNER}
            title={pinTooltip}
            onClick={onPinnClick}
          >
            {menuIsPinned ? <Icons.Pinned /> : <Icons.Pin />}
          </div>
          {/* SEARCH_LIST */}
          <div
            ref={searchListRef}
            className={classes.get({
              [CLS.SEARCH_LIST]: true,
              [CLS.SEARCH_LIST_HAS_FOUND]: hasFoundSome,
              [CLS.SEARCH_LIST_NONE_FOUND]: !isClean && !hasFoundSome,
              [CLS.PINNED]: menuIsPinned
            })}
            onClick={onItemSelect}
          >
            {!isClean && <span className={CLS.REPORT}>{hasFoundSome ? found : notFound}</span>}
            {filtered.map(({key, value, regex, isLastFound}, i, {length}) => {
              return (
                <div
                  search-id={key}
                  key={key}
                  className={classes.get({
                    [CLS.ITEM]: true,
                    [CLS.FOUND]: Boolean(regex),
                    [CLS.IS_LAST_FOUND]: isLastFound,
                    [CLS.NO_GAP]: !isLastFound && i === length - 1
                  })}
                >
                  <label className={CLS.SEARCH_TEXT}>
                    <BoldText regex={regex}>{value}</BoldText>
                  </label>
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
    pinTooltip: PropTypes.string,
    found: PropTypes.string,
    notFound: PropTypes.string,
  }),
  possibilities: PropTypes.array.isRequired,
  rowsVisible: PropTypes.number,
  toggleList: PropTypes.bool,
  onCallback: PropTypes.func
};
Search.defaultProps = {
  labels: {
    iconTooltip: LABELS.TOOLTIPS.ICON,
    searchPlaceholder: LABELS.PLACEHOLDERS.SEARCH,
    pinTooltip: LABELS.TOOLTIPS.PIN,
    found: LABELS.REPORTS.FOUND,
    notFound: LABELS.REPORTS.NO_RESULT
  },
  rowsVisible: 5,
  toggleList: true,
  onCallback: undefined
};

export default Search;
