import {getClasses, scroll} from "./DOM/common";
import {getKeysPressed, toggleEvent} from "./DOM/events";

const classes = {get: getClasses};
const events = {
  keys: {getPressed: getKeysPressed},
  init: toggleEvent
};

export {classes, events, scroll};
