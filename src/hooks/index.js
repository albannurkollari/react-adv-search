// Libraries
import React, {useEffect, useState, useCallback, useRef} from "react";

// Helpers
import {events} from '../utils';

// Constants
import {CLS} from '../constants';

// Memoized
const toggleEvent = events.init();

export const useSearch = (possibilities, onCallback) => {
  const inputSearchRef = useRef();
  const searchRowRef = useRef();
  const [filtered, setFiltered] = useState(possibilities);
  const [menuIsToggled, setMenuIsToggled] = useState(false);
  const toggleSearchVisibility = useCallback(({show} = {}) => {
    const method = show ? "add" : "remove";

    // eslint-disable-next-line no-unused-expressions
    searchRowRef?.current.classList[method]?.(CLS.FOCUSED, show);
  }, []);
  const onSearchKeydown = useCallback(
    ({keyCode, target}) => {
      if (keyCode === 27) {
        if (target.value.trim() !== "") {
          target.value = "";
        } else {
          toggleSearchVisibility({show: false});
        }

        setFiltered(possibilities);
      }
    },
    [possibilities, setFiltered, toggleSearchVisibility]
  );
  const onSearch = useCallback(
    ({target: {value: searchText}}) => {
      if (searchText.trim() === "") {
        return setFiltered(possibilities);
      }

      let items = possibilities.map(({value, ...rest}) => {
        const regex = new RegExp(`(${searchText})`, "gi");

        if (regex.test(value)) {
          const content = value
            .replace(regex, "*$1*")
            .split("*")
            .map((item, i) =>
              regex.test(item) ? <b key={`b-${i}`}>{item}</b> : item
            )
            .filter(Boolean);

          return {...rest, value, content};
        }

        return {...rest, value};
      });

      if (!menuIsToggled) {
        items = items.filter(({content}) => content);
      }

      items = items.map((item, i, {length}) => ({
        ...item,
        isLast: i === length - 1
      }));

      setFiltered(items);
    },
    [possibilities, menuIsToggled]
  );
  const onSearchFocus = useCallback(
    ({target}) => {
      const isFocused = searchRowRef?.current.classList.contains(CLS.FOCUSED);
      const iconTriggeredEvent = Boolean(target.closest(`.${CLS.SEARCH_ICON}`));

      iconTriggeredEvent
        ? toggleSearchVisibility({show: !isFocused})
        : toggleSearchVisibility({show: true});

      if (!isFocused && iconTriggeredEvent) {
        // eslint-disable-next-line no-unused-expressions
        inputSearchRef?.current.focus();
      }
    },
    [toggleSearchVisibility]
  );

  const hasFoundSome = filtered.some(({content}) => content);

  useEffect(() => {
    const selector = `.${CLS.SEARCH_BOX}`;
    const searchList = document.querySelector(selector);

    if (!(searchList instanceof Element)) {
      return;
    }

    const event = {
      name: 'onOutsideSearchList',
      type: 'click',
      handler: ({target}) => {
        if (!menuIsToggled && !target.closest(selector) && hasFoundSome) {
          [...searchList?.children].forEach(item => item.classList.remove(CLS.FOUND));
        }
      }
    }

    toggleEvent(event);

    return () => toggleEvent(event);
  }, [hasFoundSome, menuIsToggled]);

  return {
    hasFoundSome,
    inputSearchRef,
    searchRowRef,
    filtered,
    menuIsToggled,
    setMenuIsToggled,
    onSearchKeydown,
    onSearch,
    onSearchFocus
  }
};
