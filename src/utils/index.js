import {getClasses, scroll} from "./DOM/common";
import {getKeysPressed, toggleEvent} from "./DOM/events";

const events = {
  keys: {getPressed: getKeysPressed},
  init: toggleEvent
};

export {getClasses, events, scroll};
