import {getClasses, scroll} from "./DOM/common";
import {toggleEvent} from "./DOM/events";

const classes = {get: getClasses};
const events = {init: toggleEvent};

export {classes, events, scroll};
