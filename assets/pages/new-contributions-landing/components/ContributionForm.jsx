// @flow

// ----- Imports ----- //

import { ContributionFormFields } from 'pages/new-contributions-landing/components/ContributionFormFields';
import { setPayPalHasLoaded } from 'pages/new-contributions-landing/contributionsLandingActions';
import React from 'react';
import { connect } from 'react-redux';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { type PaymentHandler } from 'helpers/checkouts';
import {
  config,
  type Contrib,
  type Amount,
  type PaymentMatrix,
  type PaymentMethod,
  baseHandlers,
} from 'helpers/contributions';
import { type CheckoutFailureReason } from 'helpers/checkoutErrors';
import { openDialogBox } from 'helpers/paymentIntegrations/newPaymentFlow/stripeCheckout';
import { type PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import { type CreatePaypalPaymentData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { getAbsoluteURL } from 'helpers/url';
import { routes, payPalCancelUrl } from 'helpers/routes';

import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';
import { openDirectDebitPopUp } from 'components/directDebit/directDebitActions';

import {
  isNotEmpty,
  isSmallerOrEqual,
  isLargerOrEqual,
  maxTwoDecimals,
} from 'helpers/formValidation';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionSubmit } from './ContributionSubmit';

import { type State } from '../contributionsLandingReducer';

import {
  paymentWaiting,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  createOneOffPayPalPayment,
} from '../contributionsLandingActions';


// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  paymentComplete: boolean,
  paymentError: CheckoutFailureReason | null,
  isWaiting: boolean,
  countryGroupId: CountryGroupId,
  selectedCountryGroupDetails: CountryMetaData,
  contributionType: Contrib,
  thankYouRoute: string,
  selectedAmounts: { [Contrib]: Amount | 'other' },
  otherAmount: string | null,
  paymentMethod: PaymentMethod,
  isSignedIn: boolean,
  paymentHandlers: { [PaymentMethod]: PaymentHandler | null },
  updateFirstName: Event => void,
  updateLastName: Event => void,
  updateEmail: Event => void,
  updateState: Event => void,
  setPaymentIsWaiting: boolean => void,
  onThirdPartyPaymentAuthorised: PaymentAuthorisation => void,
  checkoutFormHasBeenSubmitted: boolean,
  setCheckoutFormHasBeenSubmitted: () => void,
  openDirectDebitPopUp: () => void,
  isDirectDebitPopUpOpen: boolean,
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => void,
  currency: IsoCurrency,
|};

// We only want to use the user state value if the form state value has not been changed since it was initialised,
// i.e it is null.
const getCheckoutFormValue = (formValue: string | null, userValue: string | null): string | null =>
  (formValue === null ? userValue : formValue);

/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  isWaiting: state.page.form.isWaiting,
  countryGroupId: state.common.internationalisation.countryGroupId,
  firstName: getCheckoutFormValue(state.page.form.formData.firstName, state.page.user.firstName),
  lastName: getCheckoutFormValue(state.page.form.formData.lastName, state.page.user.lastName),
  email: getCheckoutFormValue(state.page.form.formData.email, state.page.user.email),
  state: state.page.form.formData.state,
  selectedAmounts: state.page.form.selectedAmounts,
  otherAmount: state.page.form.formData.otherAmounts[state.page.form.contributionType].amount,
  paymentMethod: state.page.form.paymentMethod,
  isSignedIn: state.page.user.isSignedIn,
  paymentHandlers: state.page.form.paymentHandlers,
  contributionType: state.page.form.contributionType,
  checkoutFormHasBeenSubmitted: state.page.form.formData.checkoutFormHasBeenSubmitted,
  isDirectDebitPopUpOpen: state.page.directDebit.isPopUpOpen,
  currency: state.common.internationalisation.currencyId,
  paymentError: state.page.form.paymentError,
  csrf: state.page.csrf,
  payPalHasLoaded: state.page.form.payPalHasLoaded,
  payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
  paymentMethod: state.page.form.paymentMethod,
});


const mapDispatchToProps = (dispatch: Function) => ({
  updateFirstName: (event) => { dispatch(updateFirstName(event.target.value)); },
  updateLastName: (event) => { dispatch(updateLastName(event.target.value)); },
  updateEmail: (event) => { dispatch(updateEmail(event.target.value)); },
  updateState: (event) => { dispatch(updateState(event.target.value === '' ? null : event.target.value)); },
  setPaymentIsWaiting: (isWaiting) => { dispatch(paymentWaiting(isWaiting)); },
  onThirdPartyPaymentAuthorised: (token) => { dispatch(onThirdPartyPaymentAuthorised(token)); },
  setCheckoutFormHasBeenSubmitted: () => { dispatch(setCheckoutFormHasBeenSubmitted()); },
  openDirectDebitPopUp: () => { dispatch(openDirectDebitPopUp()); },
  createOneOffPayPalPayment: (data: CreatePaypalPaymentData) => { dispatch(createOneOffPayPalPayment(data)); },
  payPalSetHasLoaded: () => {
    dispatch(setPayPalHasLoaded());
  },
});

// ----- Functions ----- //

// TODO: we've got this and a similar function in contributionLandingActions
// I think a better model would be to represent the amount as a number in
// the state, and use this logic to keep it in sync with the view-level selectedAmounts and otherAmounts.
const getAmount = (props: PropTypes) =>
  parseFloat(props.selectedAmounts[props.contributionType] === 'other'
    ? props.otherAmount
    : props.selectedAmounts[props.contributionType].value);

// ----- Event handlers ----- //

function openStripePopup(props: PropTypes) {
  if (props.paymentHandlers.Stripe) {
    openDialogBox(props.paymentHandlers.Stripe, getAmount(props), props.email);
  }
}

// Bizarrely, adding a type to this object means the type-checking on the
// formHandlers is no longer accurate.
// (Flow thinks it's OK when it's missing required properties).
const formHandlersForRecurring = {
  PayPal: () => { /* TODO PayPal recurring */ },
  Stripe: openStripePopup,
  DirectDebit: (props: PropTypes) => {
    props.openDirectDebitPopUp();
  },
};

const formHandlers: PaymentMatrix<PropTypes => void> = {
  ONE_OFF: {
    ...baseHandlers.ONE_OFF,
    Stripe: openStripePopup,
    PayPal: (props: PropTypes) => {
      props.setPaymentIsWaiting(true);
      props.createOneOffPayPalPayment({
        currency: props.currency,
        amount: getAmount(props),
        returnURL: getAbsoluteURL(routes.payPalRestReturnURL),
        // TODO: use new cancel url
        cancelURL: payPalCancelUrl(props.countryGroupId),
      });
    },
  },
  MONTHLY: { ...baseHandlers.MONTHLY, formHandlersForRecurring },
  ANNUAL: { ...baseHandlers.ANNUAL, formHandlersForRecurring },
};

function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    // Causes errors to be displayed against payment fields
    props.setCheckoutFormHasBeenSubmitted();
    event.preventDefault();
    if (!(event.target: any).checkValidity()) {
      return;
    }
    formHandlers[props.contributionType][props.paymentMethod](props);
  };
}

// ----- Render ----- //

function ContributionForm(props: PropTypes) {

  const onPaymentAuthorisation = (paymentAuthorisation: PaymentAuthorisation) => {
    props.setPaymentIsWaiting(true);
    props.onThirdPartyPaymentAuthorised(paymentAuthorisation);
  };

  const checkOtherAmount: string => boolean = input =>
    isNotEmpty(input)
    && isLargerOrEqual(config[props.countryGroupId][props.contributionType].min, input)
    && isSmallerOrEqual(config[props.countryGroupId][props.contributionType].max, input)
    && maxTwoDecimals(input);

  return (
    <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
      <NewContributionType />
      <NewContributionAmount
        countryGroupDetails={props.selectedCountryGroupDetails}
        checkOtherAmount={checkOtherAmount}
      />
      <ContributionFormFields />
      <NewContributionPayment onPaymentAuthorisation={onPaymentAuthorisation} />
      <NewContributionSubmit
        whenUnableToOpen={props.setCheckoutFormHasBeenSubmitted}
      />
      <PaymentFailureMessage checkoutFailureReason={props.paymentError} />
      {props.isWaiting ? <ProgressMessage message={['Processing transaction', 'Please wait']} /> : null}
    </form>
  );
}

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
