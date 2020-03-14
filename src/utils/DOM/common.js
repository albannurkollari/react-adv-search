/* eslint-disable no-unused-expressions */
/**
 * @description Merges given classes into one string.
 * @param {String[]|Object<String,Boolean>} [classes=[]] Classes to be processed.
 * Either an array of strings or an object where each keys value is the determinator
 * whether or not to add that classname. Mandatory.
 * @returns {String} A concatenated classname string.
 */
export const getClasses = (classes = []) => {
  switch (true) {
    case classes?.constructor === Array &&
      !classes.some(cls => typeof cls !== "string"):
      return classes.join(" ");
    case classes?.constructor === Object:
      return Object.entries(classes)
        .reduce((acc, [cls, enabled]) => [...acc, Boolean(enabled) && cls], [])
        .filter(Boolean)
        .join(" ");
    default:
      return classes;
  }
};


export const scroll = {
  /**
  * @description Scrolls a container to a given Element child of it's own.
  * @param {{parent: Element|HTMLDocument, elm: Element, isDisabled: Boolean=}} options
  * Options object to be processed. Mandatory.
  * @param {Function=} onCallback Callback function to be executed with `prev` and `next`
  * scrolled elements.
  */
  to: ({parent, elm, isDisabled = false} = {}, onCallback) => {
    if (!(elm instanceof Element)) {
      elm = parent.elmToScroll;
    }

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
