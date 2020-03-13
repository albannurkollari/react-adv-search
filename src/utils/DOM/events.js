// Memoized and globally scoped
const EVENTS = {};
window.EVENTS = EVENTS;

/**
 * @description Curried function that returns an event toggling function scoped to an object
 * of `events`.
 * @param {Object} events An event collector object. Mandatory.
 * @returns {Function} An event toggling function.
 */
export const toggleEvent = (events = EVENTS) => {
  if (events?.constructor !== Object) {
    throw new Error(`Expected events collection to be an 'object' but received '${events}' instead!`);
  }

  /**
   * @param {{debug, name, handler, type, elm}} [options={}] Options to be proceed with. Mandatory.
   * @param {Boolean=} [options.debug=false] Outputs the result of the toggling event.
   * It either is addition or removal message and the function location being outputed to the console.
   * @param {String} options.name The referrenced event name, which is added/removed from the `events`
   * collection. Mandatory.
   * @param {Function} options.handler The handler/listener to be attached to the given event type. Mandatory.
   * @param {Function} options.type The event type (e.g. '`lick`) to listen to with the given listener
   * and the element to listen to. Mandatory.
   * @param {Element|HTMLDocument} [options.elm=document] An `Element` (or `document` which defaults to) for
   * which the given event type and the handler will be added to or removed from.
   *
  */
  return ({debug = false, name, handler, type, elm = document} = {}) => {
    let action;

    if (!events[type]?.[name]) {
      events[type] = {...events[type], [name]: handler};
      action = 'addEventListener';
    }
    else {
      delete events[type]?.[name];
      action = 'removeEventListener';
    }

    elm[action](type, handler);

    if (debug) {
      const keyword = events[type]?.[name] ? 'Added' : 'Removed';

      console.log(`${keyword} event: ${name}\n`, events?.[type]?.[name]);
    }
  };
}
