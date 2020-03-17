/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-expressions */
// Libraries
import {useEffect, useState, useCallback, useRef} from 'react';

// Helpers
import {getClasses, events, scroll} from '../utils';

// Constants
import {CLS} from '../constants';

// Memoized
const removePrevSelected = prevElm => prevElm?.classList.remove(CLS.SELECTED);
const removeNextSelected = nextElm => nextElm?.classList.remove(CLS.SELECTED);
const addNextSelected = nextElm => nextElm?.classList.add(CLS.SELECTED);
const [onAfterScroll, onResetScroll] = [
  (prevElm, nextElm) => {
    removePrevSelected(prevElm);
    addNextSelected(nextElm);
  },
  (prevElm, nextElm) => {
    removePrevSelected(prevElm);
    removeNextSelected(nextElm);
  }
];
const doNavigate = options => {
  const {list, pressed, menuIsPinned, hasFoundSome, onNavigate} = options;
  const jointClasses = getClasses({[CLS.ITEM]: true, [CLS.FOUND]: !menuIsPinned}, true);
  const itemsToScroll = [...list.querySelectorAll(jointClasses)];
  const selectedItemIndex = itemsToScroll.findIndex(item => item.classList.contains(CLS.SELECTED));
  const lastIndex = itemsToScroll.length - 1;
  let newIndex = {
    isHome: 0,
    isEnd: lastIndex,
    isDown: selectedItemIndex + 1,
    isUp: selectedItemIndex - 1,
  }[pressed._key];

  // Make sure new index is between these ranges.
  newIndex = newIndex <= -1 ? 0 : newIndex > lastIndex ? lastIndex : newIndex;

  const elm = itemsToScroll[newIndex];
  const isDisabled = (list.scrollHeight === list.clientHeight) || !(list.classList.contains(CLS.PINNED) || hasFoundSome);

  // Finally scroll to that child element in the list!
  if (elm && !(pressed.isCtrl && pressed.isShift)) {
    scroll.to({...scroll.getState(list), elm: itemsToScroll[newIndex], isDisabled}, onNavigate);
  }
};

export const useSearch = (possibilities, onCallback) => {
  // REFS
  const inputSearchRef = useRef();
  const searchRowRef = useRef();
  const searchListRef = useRef();

  // STATES
  const [filtered, setFiltered] = useState(possibilities);
  const [menuIsPinned, setMenuIsPinned] = useState();
  const [hasFoundSome, setHasFoundSome] = useState(false);
  const [isClean, setIsClean] = useState(true);

  // CALLBACKS
  const filterItemList = useCallback((searchFor = '') => {
    let items;
    let hasFoundItems = false;

    if (searchFor.trim().length) {
      const _filtered = [];
      const _nonFiltered = [];

      possibilities.forEach(({value, ...rest}) => {
        const regex = new RegExp(`(${searchFor})`, 'gi');
        const found = regex.test(value);
        const item = {...rest, value, ...(found && {regex})};

        (found ? _filtered : _nonFiltered).push(item);
      });

      if (_filtered[_filtered.length - 1]) {
        _filtered[_filtered.length - 1].isLastFound = true;
      }

      items = [..._filtered, ..._nonFiltered];
      hasFoundItems = Boolean(_filtered.length);
    }

    scroll.to({parent: searchListRef.current, isDisabled: true}, onResetScroll);
    setHasFoundSome(hasFoundItems);
    setFiltered(items || possibilities);
    setIsClean(!inputSearchRef.current.value.trim().length);
  }, [possibilities, setFiltered, setIsClean]);

  const manageSearchState = useCallback(({show, event} = {}) => {
    const method = (show ?? !searchRowRef?.current.classList.contains(CLS.FOCUSED)) ? 'add' : 'remove';

    // Toggle search visibility here.
    searchRowRef?.current.classList[method]?.(CLS.FOCUSED);

    if (!show) {
      inputSearchRef.current.value = '';

      setMenuIsPinned();
      filterItemList();
    }

    if (method === 'add') {
      inputSearchRef?.current.focus();
    }
  }, [filterItemList]);

  const onItemSelect = useCallback(({target, prevTarget}) => {
    const clickedItem = target.closest(`.${CLS.ITEM}`);
    const prevSelectedItem = prevTarget ?? searchListRef.current.querySelector(`.${CLS.ITEM}.${CLS.SELECTED}`);

    if (!(clickedItem instanceof Element)) {
      return;
    }

    const {value = ''} = possibilities.find(({key}) => key === clickedItem?.searchId) || {};
    inputSearchRef.current.value = value;
    searchListRef.current.elmToScroll = clickedItem;

    inputSearchRef.current.focus();
    onAfterScroll(prevSelectedItem, clickedItem);
    onCallback?.(value);
  }, [possibilities, onCallback]);

  const onSearchKeydown = useCallback(evt => {
    const {keyCode, target, ctrlKey, shiftKey} = evt;
    const pressed = events.keys.getPressed(keyCode, ctrlKey, shiftKey);

    switch (true) {
      case pressed.isEsc:
        if (target.value.trim() !== '') {
          target.value = '';
        }
        else {
          manageSearchState({show: false});
        }

        filterItemList();
        break;
      case pressed.isNavigating && (hasFoundSome || menuIsPinned):
        evt.preventDefault();
        doNavigate({
          list: searchListRef.current,
          pressed,
          menuIsPinned,
          hasFoundSome,
          onNavigate: (prev, next) => onItemSelect({target: next, prevTarget: prev})
        });

        break;
      default:
        return;
    }
  },
    [hasFoundSome, menuIsPinned, onItemSelect, filterItemList, manageSearchState]
  );
  const onSearch = useCallback(({target: {value}}) => filterItemList(value), [filterItemList]);
  const onSearchClick = useCallback(() => manageSearchState(), [manageSearchState]);
  const onPinnClick = useCallback(() => {
    setMenuIsPinned(menuIsPinned ? undefined : true);
    inputSearchRef.current?.focus();
    !isClean && !menuIsPinned && filterItemList(inputSearchRef.current.value);
  }, [isClean, menuIsPinned, setMenuIsPinned, filterItemList]);

  useEffect(() => {
    if (!(searchListRef.current instanceof Element)) {
      return;
    }

    searchListRef.current.querySelectorAll(`.${CLS.ITEM}`).forEach(listItem => {
      const attrName = 'search-id';

      listItem.searchId = listItem.getAttribute(attrName);
      listItem.removeAttribute(attrName);
    });
  }, []);

  return {
    isClean,
    hasFoundSome,
    inputSearchRef,
    searchRowRef,
    searchListRef,
    filtered,
    menuIsPinned,
    onSearchKeydown,
    onSearch,
    onSearchClick,
    onItemSelect,
    onPinnClick
  }
};
