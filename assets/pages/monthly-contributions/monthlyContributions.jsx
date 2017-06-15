// @flow

// ----- Imports ----- //

import 'ophan';
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import SimpleFooter from 'components/footers/simpleFooter/simpleFooter';
import CheckoutSection from 'components/checkoutSection/checkoutSection';
import DisplayName from 'components/displayName/displayName';
import Secure from 'components/secure/secure';
import TermsPrivacy from 'components/termsPrivacy/termsPrivacy';

import * as ga from 'helpers/ga';
import * as abTest from 'helpers/abtest';
import * as logger from 'helpers/logger';
import getQueryParameter from 'helpers/url';
import config from 'helpers/config';
import PaymentMethods from './components/paymentMethods';
import NameForm from './components/nameForm';
import ContribAmount from './components/contribAmount';
import reducer from './reducers/reducers';

import { setContribAmount, setFirstName, setLastName } from './actions/monthlyContributionsActions';

// ----- AB Tests ----- //

const participation = abTest.init();


// ----- Tracking ----- //

ga.init();
ga.setDimension('experience', abTest.getVariantsAsString(participation));
ga.trackPageview();


// ----- Logging ----- //

logger.init();


// ----- Redux Store ----- //

const store = createStore(reducer, applyMiddleware(thunkMiddleware));

// Retrieves the contrib amount from the url and sends it to the redux store.
store.dispatch(setContribAmount(getQueryParameter('contributionValue', '5')));
store.dispatch(setFirstName((config.user || {}).firstName || ''));
store.dispatch(setLastName((config.user || {}).lastName || ''));

// ----- Render ----- //

const content = (
  <Provider store={store}>
    <div>
      <SimpleHeader />
      <div className="monthly-contrib gu-content-margin">
        <CheckoutSection className="monthly-contrib__header">
          <h1 className="monthly-contrib__heading">Make a monthly contribution</h1>
          <Secure />
        </CheckoutSection>
        <CheckoutSection heading="Your monthly contribution" className="monthly-contrib__your-contrib">
          <ContribAmount />
        </CheckoutSection>
        <CheckoutSection heading="Your details" className="monthly-contrib__your-details">
          <DisplayName name={(config.user || {}).displayName || 'SignedInUser'} />
          <NameForm />
        </CheckoutSection>
        <CheckoutSection heading="Payment methods" className="monthly-contrib__payment-methods">
          <PaymentMethods email={(config.user || {}).email || ''} />
        </CheckoutSection>
        <CheckoutSection className="monthly-contrib__payment-methods">
          <TermsPrivacy
            termsLink="https://www.theguardian.com/info/2016/apr/04/contribution-terms-and-conditions"
            privacyLink="https://www.theguardian.com/help/privacy-policy"
          />
        </CheckoutSection>
      </div>
      <SimpleFooter />
    </div>
  </Provider>
);

ReactDOM.render(content, document.getElementById('monthly-contributions-page'));
