/* eslint-disable no-fallthrough */
/* eslint-disable no-unused-expressions */
// Libraries
import {useEffect, useState, useCallback, useRef} from "react";

// Helpers
import {scroll} from '../utils';

// Constants
import {CLS} from '../constants';

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
        const regex = new RegExp(`(${searchFor})`, "gi");
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

    scroll.to({parent: searchListRef.current, isDisabled: true});
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
      filterItemList();
    }

    if (method === 'add') {
      inputSearchRef?.current.focus();
    }
  }, [filterItemList]);

  const onSearchKeydown = useCallback(evt => {
    const list = searchListRef.current;
    const {keyCode, target, ctrlKey, shiftKey} = evt;
    const {classList, clientHeight, scrollHeight, scrollTop} = list;
    const _scroll = {
      isDisabled: ctrlKey
        || shiftKey
        || (scrollHeight === clientHeight)
        || !(classList.contains(CLS.PINNED) || hasFoundSome),
      isAtStart: scrollTop === 0,
      isInBetween: 0 < scrollTop && scrollTop < scrollHeight - clientHeight,
      isAtEnd: scrollHeight - clientHeight === scrollTop,
      parent: list
    };
    const pressed = {
      isEnter: keyCode === 13,
      isEsc: keyCode === 27,
      isEnd: keyCode === 35,
      isHome: keyCode === 36,
      isUp: keyCode === 38,
      isDown: keyCode === 40
    };

    const isNavigating = Object
      .entries(pressed)
      .some(([key, isPressed]) => /^is(end|home|up|down)$/i.test(key) && isPressed);

    const prevOrNextProp = `${pressed.isUp ? 'previous' : 'next'}ElementSibling`;

    switch (true) {
      case pressed.isEnter:
        break;
      case pressed.isEsc:
        if (target.value.trim() !== "") {
          target.value = "";
        }
        else {
          manageSearchState({show: false});
        }

        filterItemList();
        break;
      case pressed.isDown:
      case pressed.isUp:
        if (menuIsPinned && (_scroll.isAtStart || _scroll.isInBetween)) {
          _scroll.elm = list.elmToScroll?.[prevOrNextProp] ?? list.querySelector(`.${CLS.ITEM}`);
        }
        else if (menuIsPinned && _scroll.isAtEnd) {
          _scroll.elm = (list.elmToScroll ?? [...list.querySelectorAll(`.${CLS.ITEM}`)].pop())?.[prevOrNextProp];
        }
        else {
          const allFound = [...list.querySelectorAll(`.${CLS.ITEM}.${CLS.FOUND}`)];
          const selected = allFound.find(item => item.classList.contains(CLS.SELECTED));
          const selectedIndex = allFound.indexOf(selected);
          const newIndex = pressed.isUp
            ? selectedIndex > -1 ? selectedIndex - 1 : 0
            : selectedIndex > -1 ? selectedIndex + 1 : 0;

          _scroll.elm = allFound[newIndex]
        }
        break;
      default:
        return;
    }

    if (isNavigating && (hasFoundSome || menuIsPinned)) {
      if (_scroll.elm?.classList.contains(CLS.REPORT)) {
        _scroll.elm = list.querySelector(`.${CLS.ITEM}`);
      }

      evt.preventDefault();
      scroll.to(_scroll, (prevElm, nextElm) => {
        prevElm?.classList.remove(CLS.SELECTED);
        nextElm?.classList.add(CLS.SELECTED);
        nextElm?.click();
      });
    }

  }, [hasFoundSome, menuIsPinned, filterItemList, manageSearchState]);
  const onSearch = useCallback(({target: {value}}) => filterItemList(value), [filterItemList]);
  const onSearchClick = useCallback(() => manageSearchState(), [manageSearchState]);
  const onSearchBlur = useCallback(() => menuIsPinned ?? filterItemList(), [menuIsPinned, filterItemList]);
  const onItemSelect = useCallback(({target}) => {
    const listElm = target.closest(`.${CLS.ITEM}`,);
    const reportElm = target.closest(`.${CLS.REPORT}`)

    if (!(listElm instanceof Element) || reportElm) {
      return;
    }

    const foundItem = possibilities.find(({key}) => key === listElm.searchId) || {};

    if (foundItem) {
      inputSearchRef.current.value = foundItem.value;

      onCallback?.(foundItem);
    }

  }, [possibilities, onCallback]);
  const onPinnClick = useCallback(() => {
    setMenuIsPinned(menuIsPinned ? undefined : true);
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
    onSearchBlur,
    onItemSelect,
    onPinnClick
  }
};
