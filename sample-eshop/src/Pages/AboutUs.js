import React from 'react';
import { translate } from 'react-translate'

import KenticoImage from '../Images/kentico-cloud.jpg'
import CommerceImage from '../Images/com-tools.png'

/*
About us page.
 */
const AboutUs = (props) => {
    return (
        <div className="container">
            <h3>{props.t("header")}</h3>
            <p>{props.t("description")}</p>
            <div className="center row">
                <div className="col-md-6">
                    <img src={KenticoImage} alt="Kentico" style={{maxWidth: "100%"}}/>
                </div>
                <div className="col-md-6">
                    <img src={CommerceImage} alt="CommerceTools"/>
                </div>
            </div>
        </div>
    );
}

export default translate("About")(AboutUs);