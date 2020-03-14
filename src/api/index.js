// Constants
import {URLS} from '../constants';

const formatAllCountries = countries =>
  (countries || []).map(({alpha3Code, name}) => ({key: alpha3Code, value: name}));

export const getAllCountries = async () => {
  try {
    return formatAllCountries(await (await fetch(URLS.COUNTRIES)).json());
  }
  catch {
    console.log(URLS.COUNTRIES.ERROR_MSG);
  }

  return [];
};
