// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { userReducer as user } from 'helpers/user/userReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { stripeInlineFormReducerFor } from 'components/stripeInlineForm/stripeInlineFormReducer';
import { contributionsCheckoutReducerFor } from 'components/contributionsCheckout/contributionsCheckoutReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { CommonState } from 'helpers/page/page';
import type { PaymentMethod } from 'helpers/checkouts';
import { type RegularContributionType } from 'helpers/contributions';
import type { State as MarketingConsentState } from 'components/marketingConsent/marketingConsentReducer';

import type { Action } from './regularContributionsActions';
import type { PaymentStatus } from './components/regularContributionsPayment';


// ----- Types ----- //

export type State = {
  amount: number,
  contributionType: RegularContributionType,
  error: ?string,
  paymentStatus: PaymentStatus,
  paymentMethod: ?PaymentMethod,
  payPalHasLoaded: boolean,
  statusUri: ?string,
  pollCount: number,
  shouldValidate: boolean,
  firstNameHasBeenBlurred: boolean,
  lastNameHasBeenBlurred: boolean,
};

export type CombinedState = {
  regularContrib: State,
  user: UserState,
  csrf: CsrfState,
  directDebit: DirectDebitState,
  marketingConsent: MarketingConsentState,
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
};


// ----- Reducers ----- //

function createRegularContribReducer(
  amount: number,
  paymentMethod: ?PaymentMethod,
  contributionType: RegularContributionType,
) {

  const initialState: State = {
    amount,
    contributionType,
    error: null,
    paymentStatus: 'NotStarted',
    paymentMethod,
    payPalHasLoaded: false,
    statusUri: null,
    pollCount: 0,
    emailHasBeenBlurred: false,
  };

  return function regularContrib(state: State = initialState, action: Action): State {
    switch (action.type) {

      case 'CHECKOUT_PENDING':
        return Object.assign({}, state, { paymentStatus: 'PollingTimedOut', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_SUCCESS':
        return Object.assign({}, state, { paymentStatus: 'Success', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { paymentStatus: 'Failed', error: action.message });

      case 'CREATING_CONTRIBUTOR':
        return Object.assign({}, state, { paymentStatus: 'Pending' });

      case 'SET_PAYPAL_HAS_LOADED':
        return Object.assign({}, state, { payPalHasLoaded: true });

      case 'SET_EMAIL_HAS_BEEN_BLURRED':
        return Object.assign({}, state, { emailHasBeenBlurred: true });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootRegularContributionsReducer(
  amount: number,
  paymentMethod: ?PaymentMethod,
  contributionType: RegularContributionType,
) {
  return combineReducers({
    regularContrib: createRegularContribReducer(amount, paymentMethod, contributionType),
    marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
    user,
    csrf,
    directDebit,
  });
}
