import React from 'react'
import Link from '../Components/LowerCaseUrlLink';
import { translate } from 'react-translate'
const Footer = (props) => {

    return(
      <div className="footer-wrapper">
        <footer role="contentinfo">
          <div className="footer-container">
            <div className="container">
              <div className="row">
                <div className="col-md-4 col-lg-4 footer-col">
                  <h3 className="contact-title">{props.t("contact")}</h3>
                  <p>
                    (+1) 234-456-7890<br />
                    <Link to="mailto:diplomka@localhost.local">diplomka@localhost.local</Link><br />
                    <br /> FI MUNI Ltd<br /> Botanická 32,<br /> {props.t("cityStateZip")}
                  </p>
                </div>
                <div className="col-md-4 col-lg-4 footer-col" />
              </div>
            </div>
          </div>
        </footer>
      </div>
    )

}
export default translate("Footer")(Footer);
