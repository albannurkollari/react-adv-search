/* eslint-disable no-unused-expressions */
// Libraries
import PropTypes from 'prop-types';
import React, {useEffect} from 'react';

// Helpers
import {classes} from '../../helpers';
import {useSearch} from '../../hooks';

// Components
import SearchList from './searchList';

// Constants
import {LABELS} from '../../constants';

// Images
import * as Icons from '../../assets/img';

// Stylesheets(s)
import './styles.css';

const Search = ({
  labels: {iconTooltip, pinTooltip, searchPlaceholder, found, notFound},
  possibilities,
  rowsVisible,
  toggleList,
  onCallback
}) => {
  const searchHookObj = useSearch(possibilities, onCallback);
  const {
    hasFoundSome,
    inputSearchRef,
    searchRowRef,
    searchListRef,
    filtered,
    menuIsPinned,
    onPinnClick,
    onSearchKeydown,
    onSearch,
    onSearchClick
  } = searchHookObj;

  useEffect(() => {
    document.documentElement.style.setProperty('--maxRowsVisible', rowsVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={classes.wrapper({toggleList})}>
      {possibilities.length && (
        <>
          {/* SEARCH_ROW */}
          <div ref={searchRowRef} className={classes.searchRow}>
            <div className={classes.searchIcon} title={iconTooltip} onClick={onSearchClick}>
              {hasFoundSome ? <Icons.SearchFound /> : <Icons.Search />}
            </div>
            <input
              ref={inputSearchRef}
              alt='search'
              placeholder={searchPlaceholder}
              spellCheck={false}
              onChange={onSearch}
              onKeyDown={onSearchKeydown}
            />
            <span className={classes.searchRowBorder} />
          </div>
          {/* SEARCH_LIST_PINNER */}
          <div className={classes.pinner} title={pinTooltip} onClick={onPinnClick}>
            {menuIsPinned ? <Icons.Pinned /> : <Icons.Pin />}
          </div>
          {/* SEARCH_LIST */}
          <SearchList
            ref={searchListRef}
            list={filtered}
            labels={{found, notFound}}
            {...searchHookObj}
          />
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
