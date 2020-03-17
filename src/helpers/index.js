// Helpers
import {getClasses} from '../utils';

// Constants
import {CLS} from '../constants';

export const classes = ({
  searchRow: CLS.SEARCH_ROW,
  searchIcon: CLS.SEARCH_ICON,
  searchRowBorder: CLS.SEARCH_ROW_BORDERS,
  pinner: CLS.SEARCH_PINNER,
  report: CLS.REPORT,
  itemText: CLS.SEARCH_TEXT,
  wrapper: ({toggleList}) => getClasses({
    [CLS.SEARCH_BOX]: true,
    [CLS.SEARCH_BOX_WITH_PIN]: toggleList
  }),
  list: ({hasFoundSome, isClean, menuIsPinned}) => getClasses({
    [CLS.SEARCH_LIST]: true,
    [CLS.SEARCH_LIST_HAS_FOUND]: hasFoundSome,
    [CLS.SEARCH_LIST_NONE_FOUND]: !isClean && !hasFoundSome,
    [CLS.PINNED]: menuIsPinned
  }),
  item: ({regex, isLastFound, i, length}) => getClasses({
    [CLS.ITEM]: true,
    [CLS.FOUND]: Boolean(regex),
    [CLS.IS_LAST_FOUND]: isLastFound,
    [CLS.NO_GAP]: !isLastFound && i === length - 1
  })
});
