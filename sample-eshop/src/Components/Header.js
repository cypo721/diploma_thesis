import React, { Component } from 'react';
import { translate } from 'react-translate';


import Link from '../Components/LowerCaseUrlLink';

import { englishCode, czechCode } from '../Utilities/LanguageCodes';
import CartStore from '../Stores/Cart';

let getState = (props) => {
    return {
        cart: CartStore.getCart()
    };
};

//const Header = (props) => {
class Header extends Component {

  constructor(props){
    super(props);
    this.state = getState(props);
    this.onChange = this.onChange.bind(this);
  }
    componentDidMount() {
        CartStore.addChangeListener(this.onChange);
        if (!this.state.cart) {
          CartStore.provideCart()
        }
    }

    componentWillUnmount() {
        CartStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState(getState(this.props));
    }

  render (){
    return (
      <header className="header" role="banner">
        <div className="menu">
          <div className="container">
            <nav role="navigation">
              <ul>
                <li>
                  <Link to={`/${this.props.language}`}>{this.props.t("homeLinkTitle")}</Link>
                </li>
                <li>
                  <Link to={`/${this.props.language}/store`}>{this.props.t("storeLinkTitle")}</Link>
                </li>
                {
                  this.props.language.toLowerCase() === englishCode.toLowerCase() ?
                    <li>
                      <Link to={`/${this.props.language}/about-us`}>{this.props.t("aboutLinkTitle")}</Link>
                    </li>
                    : this.props.language.toLowerCase() === czechCode.toLowerCase() ?
                        <li>
                          <Link to={`/${this.props.language}/o-nas`}>{this.props.t("aboutLinkTitle")}</Link>
                        </li>
                    : null
                }
                <li>
                  <Link to={`/${this.props.language}/contacts`}>{this.props.t("contactsLinkTitle")}</Link>
                </li>
              </ul>
            </nav>
            <div className="additional-menu-buttons user-menu">
              <nav role="navigation">
                <ul className="dropdown-items-list dropdown-desktop-visible">
                  <li>
                    <Link to={`/${this.props.language}/cart`}>{this.state.cart ? this.state.cart.lineItems.length : '0'} {this.props.t('items')} </Link>
                  </li>
                  <li>
                    <a onClick={() =>
                      location.pathname.endsWith('o-nas') ? this.props.changeLanguage(englishCode, "/about-us") : this.props.changeLanguage(englishCode)
                    }>English</a>
                  </li>
                  <li>
                    <a onClick={() =>
                      location.pathname.endsWith('about-us') ? this.props.changeLanguage(czechCode, "/o-nas") : this.props.changeLanguage(czechCode)
                    }>Czech</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="header-row">
          <div className="container">
            <div className="col-xs-8 col-md-8 col-lg-4 logo">
              <h1 className="logo">
                <Link to={`/${this.props.language}`} className="logo-link">Sample Eshop</Link>
              </h1>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default translate("Header")(Header);
