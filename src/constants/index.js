// URLS
const COUNTRIES = new URL('https://restcountries.eu/rest/v2/all');

// URL ERROR MESSAGES
COUNTRIES.ERROR_MSG = `Something went wrong during when requesting data from:\n${COUNTRIES.toString()}`

export const URLS = {COUNTRIES};

export const CLS = {
  ROOT: 'root',
  APP_MAIN: 'main',
  NO_GAP: 'no-gap',
  SEARCH_BOX: 'search-box__wrapper',
  SEARCH_BOX_WITH_PIN: 'with-pin',
  SEARCH_PINNER: 'pin-search-list',
  SEARCH_ROW: 'search-row',
  SEARCH_LIST: 'search-list',
  PINNED: 'pinned',
  SEARCH_LIST_HAS_FOUND: 'has-found',
  SEARCH_LIST_NONE_FOUND: 'none-found',
  ITEM: 'item',
  FOUND: 'found',
  REPORT: 'report',
  SEARCH_TEXT: 'text',
  IS_LAST_FOUND: 'is-last-found',
  FOCUSED: 'focused',
  SEARCH_ICON: 'search-icon',
  SEARCH_ROW_BORDERS: 'borders',
  SELECTED: 'selected'
};

export const LABELS = {
  TOOLTIPS: {
    ICON: 'Click here to start search',
    PIN: 'Click to pin/unpin the list'
  },
  PLACEHOLDERS: {
    SEARCH: 'Search here'
  },
  REPORTS: {
    FOUND: 'Found:',
    NO_RESULT: 'No result!'
  }
}

export const PEOPLE = [
  {
    key: "bani",
    value: "Alban Nurkollari"
  },
  {
    key: "dona",
    value: "Edona Rexhaj-Nurkollari"
  },
  {
    key: "aro",
    value: "Arjeta Nurkollari"
  },
  {
    key: "bes",
    value: "Besnik Nurkollari"
  },
  {
    key: 'brian',
    value: "Brian O'Chan"
  },
  {
    key: "edi",
    value: "Edina Nurkollari-Bytyqi"
  },
  {
    key: "beta",
    value: "Bejtulla Bytyqi"
  },
  {
    key: "roki",
    value: "Roar Bytyqi"
  },
  {
    key: "nik",
    value: "Niklas Gullberg"
  },
  {
    key: "nelly",
    value: "Nelly"
  }
];