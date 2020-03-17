// Libraries
import PropTypes from 'prop-types';
import React from 'react';

// Helpers
import {classes} from '../../helpers';

// Components
import BoldText from '../BoldText';

const SearchList = React.forwardRef(({
  detached,
  list,
  labels,
  menuIsPinned,
  hasFoundSome,
  isClean,
  onItemSelect
}, ref) => {
  return <div
    ref={ref}
    className={classes.list({detached, hasFoundSome, isClean, menuIsPinned})}
    onClick={onItemSelect}
  >
    {!isClean && <span className={classes.report}>{hasFoundSome ? labels.found : labels.notFound}</span>}
    {list.map(({key, value, regex, isLastFound}, i, {length}) => {
      return (
        <div key={key} search-id={key} className={classes.item({regex, isLastFound, i, length})}>
          <label className={classes.itemText}><BoldText regex={regex}>{value}</BoldText></label>
        </div>
      );
    })}
  </div>;
});
SearchList.propTypes = {
  detached: PropTypes.bool,
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
    regex: PropTypes.instanceOf(RegExp),
    isLastFound: PropTypes.bool
  })),
  labels: PropTypes.exact({
    found: PropTypes.string.isRequired,
    notFound: PropTypes.string.isRequired
  }),
  menuIsPinned: PropTypes.bool,
  hasFoundSome: PropTypes.bool,
  isClean: PropTypes.bool,
  onItemSelect: PropTypes.func.isRequired
};
SearchList.defaultProps = {
  detached: false,
  list: [],
  labels: undefined,
  menuIsPinned: undefined,
  hasFoundSome: undefined,
  isClean: undefined
};

export default SearchList;
