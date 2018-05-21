import React from 'react';
import { Switch, Route, Link } from 'react-router-dom'
import { translate } from 'react-translate'

import TabletStore from '../Components/TabletStore';
import NotebookStore from '../Components/NotebookStore';
import MobileStore from '../Components/MobilesStore';

/*
Routing between items in store.
 */
const Store = (props) => {
  return (
    <div className="container">
      <div className="container product-page-container">
        <nav role="navigation" className="sub-menu row">
          <div className="store-menu-list row">
            <ul>
              <li>
                <Link to={`${props.match.url}/tablets`}>{props.t("tabletsLinkTitle")}</Link>
              </li>
              <li>
                <Link to={`${props.match.url}/notebooks`}>{props.t("notebooksLinkTitle")}</Link>
              </li>
              <li>
                <Link to={`${props.match.url}/mobiles`}>{props.t("mobilesLinkTitle")}</Link>
              </li>
            </ul>
          </div>
        </nav>
        <Switch>
          <Route exact path={`${props.match.url}`} render={() => <TabletStore language={props.language} />} />
          <Route path={`${props.match.url}/tablets`} render={() => <TabletStore language={props.language} />} />
          <Route path={`${props.match.url}/notebooks`} render={() => <NotebookStore language={props.language} />} />
          <Route path={`${props.match.url}/mobiles`} render={() => <MobileStore language={props.language} />} />
        </Switch>
      </div>
    </div>
  );
}

export default translate("Store")(Store);