// Libraries
import PropTypes from 'prop-types';
import React from 'react';

const DEFAULT_HIGHLIGHT_LETTER_COLOR = '#80d9ff';

const getBoldProps = (index, highLight) => {
  const {color, bgColor, indentLeft, indentRight} = highLight || {};

  return {
    key: `boldText-${index}`,
    ...(highLight && {
      style: {
        ...(color && {color: color}),
        ...(bgColor && {backgroundColor: bgColor}),
        ...(indentLeft && {paddingLeft: `${indentLeft}px`}),
        ...(indentRight && {paddingRight: `${indentRight}px`})
      }
    })
  };
}

const BoldText = ({children: text, highlight, regex}) => <>{
  text
    .replace(regex, "*$1*")
    .split("*")
    .map((item, i) => regex?.test(item)
      ? <b {...getBoldProps(i, highlight)}>{item}</b>
      : item)
    .filter(Boolean)
}</>;

BoldText.propTypes = {
  regex: PropTypes.instanceOf(RegExp),
  children: PropTypes.string,
  highlight: PropTypes.oneOfType([PropTypes.bool, PropTypes.shape({
    color: PropTypes.string,
    bgColor: PropTypes.string,
    indentLeft: PropTypes.number,
    indentRight: PropTypes.number
  })])
};

BoldText.defaultProps = {
  children: '',
  highlight: {
    color: undefined,
    bgColor: DEFAULT_HIGHLIGHT_LETTER_COLOR,
    indentLeft: 1,
    indentRight: 1
  },
  regex: undefined
};

export default BoldText;
