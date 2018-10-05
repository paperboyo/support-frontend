// @flow

// ----- Imports ----- //

import { type PaymentHandler } from 'helpers/checkouts';
import { type Amount, type Contrib, type PaymentMethod } from 'helpers/contributions';
import { type CaState, type UsState } from 'helpers/internationalisation/country';
import type { RegularPaymentRequest } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import {
  type PaymentAuthorisation,
  regularPaymentFieldsFromAuthorisation,
  type PaymentResult,
  postRegularPaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { StripeChargeData } from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import {
  type CreatePaypalPaymentData,
  type CreatePayPalPaymentResponse,
  postOneOffPayPalCreatePaymentRequest,
  postOneOffStripeExecutePaymentRequest,
} from 'helpers/paymentIntegrations/newPaymentFlow/oneOffContributions';
import {
  derivePaymentApiAcquisitionData,
  getOphanIds,
  getSupportAbTests,
} from 'helpers/tracking/acquisitions';
import trackConversion from 'helpers/tracking/conversions';
import * as cookie from 'helpers/cookie';
import { type State, type UserFormData, type ThankYouPageStage } from './contributionsLandingReducer';

export type Action =
  | { type: 'UPDATE_CONTRIBUTION_TYPE', contributionType: Contrib, paymentMethodToSelect: PaymentMethod }
  | { type: 'UPDATE_PAYMENT_METHOD', paymentMethod: PaymentMethod }
  | { type: 'UPDATE_FIRST_NAME', firstName: string }
  | { type: 'UPDATE_LAST_NAME', lastName: string }
  | { type: 'UPDATE_EMAIL', email: string }
  | { type: 'UPDATE_PASSWORD', password: string }
  | { type: 'UPDATE_STATE', state: UsState | CaState | null }
  | { type: 'UPDATE_USER_FORM_DATA', userFormData: UserFormData }
  | { type: 'UPDATE_PAYMENT_READY', paymentReady: boolean, paymentHandlers: ?{ [PaymentMethod]: PaymentHandler } }
  | { type: 'SELECT_AMOUNT', amount: Amount | 'other', contributionType: Contrib }
  | { type: 'UPDATE_OTHER_AMOUNT', otherAmount: string }
  | { type: 'PAYMENT_RESULT', paymentResult: Promise<PaymentResult> }
  | { type: 'PAYMENT_FAILURE', error: string }
  | { type: 'PAYMENT_WAITING', isWaiting: boolean }
  | { type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' }
  | { type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken: string }
  | { type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage: ThankYouPageStage }
  | { type: 'PAYMENT_SUCCESS' };

const updateContributionType = (contributionType: Contrib, paymentMethodToSelect: PaymentMethod): Action =>
  ({ type: 'UPDATE_CONTRIBUTION_TYPE', contributionType, paymentMethodToSelect });

const updatePaymentMethod = (paymentMethod: PaymentMethod): Action =>
  ({ type: 'UPDATE_PAYMENT_METHOD', paymentMethod });

const updateFirstName = (firstName: string): Action => ({ type: 'UPDATE_FIRST_NAME', firstName });

const updateLastName = (lastName: string): Action => ({ type: 'UPDATE_LAST_NAME', lastName });

const updateEmail = (email: string): Action => ({ type: 'UPDATE_EMAIL', email });

const updatePassword = (password: string): Action => ({ type: 'UPDATE_PASSWORD', password });

const updateUserFormData = (userFormData: UserFormData): Action => ({ type: 'UPDATE_USER_FORM_DATA', userFormData });

const updateState = (state: UsState | CaState | null): Action => ({ type: 'UPDATE_STATE', state });

const selectAmount = (amount: Amount | 'other', contributionType: Contrib): Action =>
  ({
    type: 'SELECT_AMOUNT', amount, contributionType,
  });

const setCheckoutFormHasBeenSubmitted = (): Action => ({ type: 'SET_CHECKOUT_FORM_HAS_BEEN_SUBMITTED' });

const setPasswordHasBeenSubmitted = (): Action => ({ type: 'SET_PASSWORD_HAS_BEEN_SUBMITTED' });


const updateOtherAmount = (otherAmount: string): Action => ({ type: 'UPDATE_OTHER_AMOUNT', otherAmount });

const paymentSuccess = (): Action => ({ type: 'PAYMENT_SUCCESS' });

const paymentWaiting = (isWaiting: boolean): Action => ({ type: 'PAYMENT_WAITING', isWaiting });

const paymentFailure = (error: string): Action => ({ type: 'PAYMENT_FAILURE', error });

const setGuestAccountCreationToken = (guestAccountCreationToken: string): Action =>
  ({ type: 'SET_GUEST_ACCOUNT_CREATION_TOKEN', guestAccountCreationToken });

const setThankYouPageStage = (thankYouPageStage: ThankYouPageStage): Action =>
  ({ type: 'SET_THANK_YOU_PAGE_STAGE', thankYouPageStage });

const isPaymentReady = (paymentReady: boolean, paymentHandlers: ?{ [PaymentMethod]: PaymentHandler }): Action =>
  ({ type: 'UPDATE_PAYMENT_READY', paymentReady, paymentHandlers: paymentHandlers || null });


const getAmount = (state: State) =>
  parseFloat(state.page.form.selectedAmounts[state.page.form.contributionType] === 'other'
    ? state.page.form.formData.otherAmounts[state.page.form.contributionType].amount
    : state.page.form.selectedAmounts[state.page.form.contributionType].value);

const stripeChargeDataFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): StripeChargeData => ({
  paymentData: {
    currency: state.common.internationalisation.currencyId,
    amount: getAmount(state),
    token: authorisation.paymentMethod === 'Stripe' ? authorisation.token : '',
    email: state.page.form.formData.email || '',
  },
  acquisitionData: derivePaymentApiAcquisitionData(
    state.common.referrerAcquisitionData,
    state.common.abParticipations,
    state.common.optimizeExperiments,
  ),
});

const regularPaymentRequestFromAuthorisation = (
  authorisation: PaymentAuthorisation,
  state: State,
): RegularPaymentRequest => ({
  firstName: state.page.form.formData.firstName || '',
  lastName: state.page.form.formData.lastName || '',
  country: state.common.internationalisation.countryId,
  state: state.page.form.formData.state,
  email: state.page.form.formData.email || '',
  contribution: {
    amount: getAmount(state),
    currency: state.common.internationalisation.currencyId,
    billingPeriod: state.page.form.contributionType === 'MONTHLY' ? 'Monthly' : 'Annual',
  },
  paymentFields: regularPaymentFieldsFromAuthorisation(authorisation),
  ophanIds: getOphanIds(),
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  supportAbTests: getSupportAbTests(state.common.abParticipations, state.common.optimizeExperiments),
});

// A PaymentResult represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// This will execute at the end of every checkout, with the exception
// of PayPal one-off where this happens on the backend after the user is redirected to our site.
const onPaymentResult = (paymentResult: Promise<PaymentResult>) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    paymentResult.then((result) => {
      const state = getState();

      switch (result.paymentStatus) {
        case 'success':
          trackConversion(state.common.abParticipations, '/contribute/thankyou.new');
          dispatch(paymentSuccess());
          break;

        default:
          dispatch(paymentFailure(result.error));
      }
    });
  };

const onCreateOneOffPayPalPaymentResponse =
  (paymentResult: Promise<CreatePayPalPaymentResponse>) =>
    (dispatch: Dispatch<Action>, getState: () => State): void => {
      paymentResult.then((result: CreatePayPalPaymentResponse) => {
        const state = getState();

        const acquisitionData = derivePaymentApiAcquisitionData(
          state.common.referrerAcquisitionData,
          state.common.abParticipations,
          state.common.optimizeExperiments,
        );

        // We've only created a payment at this point, and the user has to get through
        // the PayPal flow on their site before we can actually try and execute the payment.
        // So we drop a cookie which will be used by the /paypal/rest/return endpoint
        // that the user returns to from PayPal, if payment is successful.
        cookie.set('acquisition_data', encodeURIComponent(JSON.stringify(acquisitionData)));

        if (result.type === 'success') {
          window.location.href = result.data.approvalUrl;
        }

        // For PayPal create payment errors, the Payment API passes through the
        // error from PayPal's API which we don't want to expose to the user.
        dispatch(paymentFailure('There was an error with your payment'));
      });
    };

// The steps for one-off payment can be summarised as follows:
// 1. Create a payment
// 2. Authorise a payment
// 3. Execute a payment (money is actually taken at this point)
//
// For PayPal: we do 1 clientside, they do 2, we do 3 but serverside
// For Stripe: they do 1 & 2, we do 3 clientside.
//
// So from the clientside perspective, for one-off we just see "create payment" for PayPal
// and "execute payment" for Stripe, and these are not synonymous.
const createOneOffPayPalPayment = (data: CreatePaypalPaymentData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onCreateOneOffPayPalPaymentResponse(postOneOffPayPalCreatePaymentRequest(data)));
  };

const executeStripeOneOffPayment = (data: StripeChargeData) =>
  (dispatch: Dispatch<Action>): void => {
    dispatch(onPaymentResult(postOneOffStripeExecutePaymentRequest(data)));
  };

function recurringPaymentAuthorisationHandler(
  dispatch: Dispatch<Action>,
  state: State,
  paymentAuthorisation: PaymentAuthorisation,
): void {
  const request = regularPaymentRequestFromAuthorisation(paymentAuthorisation, state);

  dispatch(onPaymentResult(postRegularPaymentRequest(
    request,
    state.common.abParticipations,
    state.page.csrf,
    (token: string) => dispatch(setGuestAccountCreationToken(token)),
    (thankYouPageStage: ThankYouPageStage) => dispatch(setThankYouPageStage(thankYouPageStage)),
  )));
}

const recurringPaymentAuthorisationHandlers: {
  [PaymentMethod]: (Dispatch<Action>, State, PaymentAuthorisation) => void
} = {
  // These are all the same because there's a single endpoint in
  // support-frontend which handles all requests to create a recurring payment
  PayPal: recurringPaymentAuthorisationHandler,
  Stripe: recurringPaymentAuthorisationHandler,
  DirectDebit: recurringPaymentAuthorisationHandler,
};

const paymentAuthorisationHandlers: {
  [Contrib]: {
    [PaymentMethod]: (Dispatch<Action>, State, PaymentAuthorisation) => void
  }
} = {
  ONE_OFF: {
    PayPal: () => {
      // No handler required.
      // Executing a one-off PayPal payment happens on the backend in the /paypal/rest/return
      // endpoint, after PayPal redirects the browser back to our site.
    },
    Stripe: (dispatch: Dispatch<Action>, state: State, paymentAuthorisation: PaymentAuthorisation): void => {
      dispatch(executeStripeOneOffPayment(stripeChargeDataFromAuthorisation(paymentAuthorisation, state)));
    },
  },
  ANNUAL: recurringPaymentAuthorisationHandlers,
  MONTHLY: recurringPaymentAuthorisationHandlers,
};

const onThirdPartyPaymentAuthorised = (paymentAuthorisation: PaymentAuthorisation) =>
  (dispatch: Dispatch<Action>, getState: () => State): void => {
    const state = getState();

    paymentAuthorisationHandlers[state.page.form.contributionType][state.page.form.paymentMethod](
      dispatch,
      state,
      paymentAuthorisation,
    );
  };


export {
  updateContributionType,
  updatePaymentMethod,
  updateFirstName,
  updateLastName,
  updateEmail,
  updateState,
  updateUserFormData,
  isPaymentReady,
  selectAmount,
  updateOtherAmount,
  paymentFailure,
  paymentWaiting,
  paymentSuccess,
  onThirdPartyPaymentAuthorised,
  setCheckoutFormHasBeenSubmitted,
  setGuestAccountCreationToken,
  setThankYouPageStage,
  setPasswordHasBeenSubmitted,
  updatePassword,
  createOneOffPayPalPayment,
};
