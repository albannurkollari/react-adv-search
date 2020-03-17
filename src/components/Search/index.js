/* eslint-disable no-unused-expressions */
// Libraries
import PropTypes from 'prop-types';
import React, {useCallback, useEffect} from 'react';
import ReactDOM from 'react-dom';
import {debounce} from 'lodash';

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

// Memoized
const repositionSearchList = debounce((list, searchBox) => {
  if (!(list instanceof Element) || !(searchBox instanceof Element)) {
    return;
  }

  const {x, bottom} = searchBox.getBoundingClientRect();
  list.style.left = `${x}px`;
  list.style.top = `${bottom + 2}px`;

  setTimeout(() => {
    list.style.width = `${searchBox.getBoundingClientRect().width}px`;
    console.log(list.getBoundingClientRect());
  }, 250);
}, 250);

const Search = ({
  labels: {iconTooltip, pinTooltip, searchPlaceholder, found, notFound},
  possibilities,
  detached,
  rowsVisible,
  toggleList,
  onCallback
}) => {
  const searchHookObj = useSearch(possibilities, onCallback);
  const {
    isVisible,
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
  const reposition = useCallback(
    () => repositionSearchList(searchListRef.current, inputSearchRef.current),
    [searchListRef, inputSearchRef]
  );

  const List = <SearchList
    ref={searchListRef}
    detached={detached}
    list={filtered}
    labels={{found, notFound}}
    {...searchHookObj}
  />;

  useEffect(() => {
    document.documentElement.style.setProperty('--maxRowsVisible', rowsVisible);

    if (detached) {
      window.addEventListener('resize', reposition);
    }

    return () => void window.removeEventListener('resize', reposition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (detached && isVisible) {
      reposition();
    }
  }, [detached, isVisible, reposition]);

  return (
    <div className={classes.wrapper({toggleList})}>
      {possibilities.length && (
        <>
          {/* SEARCH_ROW */}
          <div ref={searchRowRef} className={classes.row({isVisible})}>
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
          {detached ? ReactDOM.createPortal(List, document.body) : List}
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
  detached: PropTypes.bool,
  possibilities: PropTypes.array.isRequired,
  rowsVisible: PropTypes.number,
  toggleList: PropTypes.bool,
  onCallback: PropTypes.func
};
Search.defaultProps = {
  detached: false,
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
