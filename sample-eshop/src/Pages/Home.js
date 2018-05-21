import React from 'react';
import { translate } from 'react-translate'

import Banner from '../Components/Banner.js';
import LinkButton from '../Components/LinkButton.js';

import {englishCode, czechCode} from '../Utilities/LanguageCodes';

/*
Home page.
 */
const Home = (props) => {
  return (
    <div className="container">
      <Banner />
      {
        props.language && props.language.toLowerCase() === englishCode.toLowerCase() ?
          <LinkButton link={`/${props.language}/about-us`} text={props.t("aboutLinkText")} />
            : props.language && props.language.toLowerCase() === czechCode.toLowerCase() ?
                <LinkButton link={`/${props.language}/o-nas`} text={props.t("aboutLinkText")} />
            : null
      }
    </div>
  );
}

export default translate("Home")(Home);