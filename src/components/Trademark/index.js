// Libraries
import PropTypes from 'prop-types';
import React from 'react';

// Images
import * as Icons from "../../assets/img";

// Stylesheet(s)
import './styles.css';

const Footer = ({children}) => {
  return <>
    <div className='external'>
      {children && children}
    </div>
    <div className='trademark'>
      <span>Made with <Icons.Hearts className='trademark__hearts' /> by</span>
      <a
        href='https://github.com/albannurkollari/'
        rel='noopener noreferrer'
        target='_blank'
        title='Opens in a new tab'
      >
        <Icons.Erenndriel className='trademark__erenndriel' />
      </a>
    </div>
  </>;
};
Footer.propTypes = {children: PropTypes.node};
Footer.defaultProps = {children: undefined};

export default Footer;
