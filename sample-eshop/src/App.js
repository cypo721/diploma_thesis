import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from './Components/Header.js';
import Footer from './Components/Footer.js'
import HomePage from './Pages/Home';
import AboutPage from './Pages/AboutUs';
import StorePage from './Pages/Store';
import TabletPage from './Pages/Tablet';
import NotebookPage from './Pages/Notebook';
import MobilePage from './Pages/Mobile';
import ContactsPage from "./Pages/Contacts"
import CartPage from "./Pages/Cart"

/*
Used to route between pages.
 */
const App = (props) => {
  return (
    <div>
      <Header cart={props.cart} language={props.language} changeLanguage={props.changeLanguage} />
      <Switch>
        <Route path="/:lang?/store" render={(matchProps) => <StorePage {...matchProps} language={props.language} cart={props.cart} />} />
        <Route path="/:lang?/tablets/:tabletSlug" render={(matchProps) => <TabletPage {...matchProps} language={props.language} cart={props.cart} />} />
        <Route path="/:lang?/notebooks/:notebookSlug" render={(matchProps) => <NotebookPage {...matchProps} language={props.language} cart={props.cart}/>} />
        <Route path="/:lang?/mobiles/:mobileSlug" render={(matchProps) => <MobilePage {...matchProps} language={props.language} cart={props.cart} />} />
        <Route path="/:lang?/contacts" render={(matchProps) => <ContactsPage {...matchProps} language={props.language} cart={props.cart}/>} />
        <Route path="/:lang?/cart" render={(matchProps) => <CartPage {...matchProps} language={props.language} cart={props.cart}/>} />
        <Route exact path="/:lang?" render={(matchProps) => <HomePage  {...matchProps} language={props.language} cart={props.cart}/>} />
        <Route path="/:lang?/:urlSlug?" render={(matchProps) => <AboutPage {...matchProps} language={props.language} cart={props.cart}/>} />
        <Route path="*" render={(props) => { return <Redirect to="/" push /> }} />
      </Switch>
      <Footer language={props.language} />
    </div>
  );
}

export default App;
