/**
 *
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
