// Libraries
import PropTypes from "prop-types";
import React, { useRef, useEffect } from "react";

// Images
import * as Icons from "../../assets/img";

// Stylesheet(s)
import "./styles.css";

const Footer = ({ children }) => {
  // State
  const gitHubSponsorship = useRef();

  // Effects
  useEffect(() => {
    if (gitHubSponsorship.current instanceof Element) {
      debugger;
    }
    // github-sponsorship
  }, []);

  return (
    <>
      <div className="external">{children && children}</div>
      <div className="trademark">
        <span>
          Made with <Icons.Hearts className="trademark__hearts" /> by
        </span>
        <a
          href="https://github.com/sponsors/albannurkollari"
          rel="noopener noreferrer"
          target="_blank"
          title="Sponsort Alban Nurkollari"
        >
          <Icons.Erenndriel className="trademark__erenndriel" />
        </a>
      </div>
    </>
  );
};
Footer.propTypes = { children: PropTypes.node };
Footer.defaultProps = { children: undefined };

export default Footer;
