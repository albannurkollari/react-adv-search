/* eslint-disable no-unused-expressions */
/**
 * @description Merges given classes into one string.
 * @param {String[]|Object<String,Boolean>} [classes=[]] Classes to be processed.
 * Either an array of strings or an object where each keys value is the determinator
 * whether or not to add that classname. Mandatory.
 * @param {Boolean=} [raw=false] Whether to return as raw selector.
 * @returns {String} A concatenated classname string.
 */
export const getClasses = (classes = [], raw = false) => {
  const deliminator = raw ? '.' : ' ';
  const prefix = raw ? '.' : '';
  let formatted;

  switch (true) {
    case classes?.constructor === Array &&
      !classes.some(cls => typeof cls !== "string"):
      formatted = classes;
      break;
    case classes?.constructor === Object:
      formatted = Object.entries(classes)
        .reduce((acc, [cls, enabled]) => [...acc, Boolean(enabled) && cls], [])
        .filter(Boolean);
      break;
    default:
      return classes;
  }

  return `${prefix}${formatted.join(deliminator)}`;
};


export const scroll = {
  /**
   * @description Gets the current scroll state of a given Element.
   * @param {Element|HTMLDocument} elm Given element of scroll statements. Mandatory.
   * @returns {Object} Scroll state object for given Element with
   * `isAtStart`, `isInBetween`, `isAtEnd` and the element itself as `parent`.
   */
  getState: elm => {
    const {clientHeight, scrollHeight, scrollTop} = elm;
    const maxScrollHeight = scrollHeight - clientHeight;
    const isAtStart = scrollTop === 0;
    const isInBetween = 0 < scrollTop && scrollTop < maxScrollHeight;
    const isAtEnd = maxScrollHeight === scrollTop;

    return {parent: elm, isAtStart, isInBetween, isAtEnd};
  },
  /**
  * @description Scrolls a container to a given Element child of it's own.
  * @param {{parent: Element|HTMLDocument, elm: Element, isDisabled: Boolean=}} options
  * Options object to be processed. Mandatory.
  * @param {Function=} onCallback Callback function to be executed with `prev` and `next`
  * scrolled elements.
  */
  to: ({parent, elm, isDisabled = false} = {}, onCallback) => {
    const prevElm = parent.elmToScroll;

    if (isDisabled) {
      parent.scrollTop = 0;
      delete parent.elmToScroll;
    }
    else {
      elm?.scrollIntoView({block: 'nearest', behavior: 'smooth'});
    }

    parent.elmToScroll = elm;

    onCallback?.(prevElm, elm);
  }
};
