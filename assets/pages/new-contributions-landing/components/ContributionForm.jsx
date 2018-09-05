// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import type { Dispatch } from 'redux';

import { countryGroupSpecificDetails, type CountryMetaData } from 'helpers/internationalisation/contributions';
import { type CountryGroupId, countryGroups } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { type OptimizeExperiments } from 'helpers/tracking/optimize';
import { type IsoCurrency } from 'helpers/internationalisation/currency';
import { type Participations } from 'helpers/abTests/abtest';
import { setupStripeCheckout, openDialogBox, createTokenCallback } from 'helpers/paymentIntegrations/stripeCheckout';
import trackConversion from 'helpers/tracking/conversions';

import ErrorMessage from 'components/errorMessage/errorMessage';
import SvgEnvelope from 'components/svgs/envelope';
import SvgUser from 'components/svgs/user';

import { NewContributionType } from './ContributionType';
import { NewContributionAmount } from './ContributionAmount';
import { NewContributionPayment } from './ContributionPayment';
import { NewContributionState } from './ContributionState';
import { NewContributionSubmit } from './ContributionSubmit';
import { NewContributionTextInput } from './ContributionTextInput';

import { type State } from '../contributionsLandingReducer';
import { type Action, paymentSuccess, paymentFailure } from '../contributionsLandingActions';

// ----- Types ----- //
/* eslint-disable react/no-unused-prop-types */
type PropTypes = {|
  done: boolean,
  error: string | null,
  isTestUser: boolean,
  countryGroupId: CountryGroupId,
  currency: IsoCurrency,
  selectedCountryGroupDetails: CountryMetaData,
  abParticipations: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
  optimizeExperiments: OptimizeExperiments,
  onSuccess: () => void,
  onError: string => void,
|};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = (state: State) => ({
  isTestUser: state.page.user.isTestUser || false,
  referrerAcquisitionData: state.common.referrerAcquisitionData,
  abParticipations: state.common.abParticipations,
  optimizeExperiments: state.common.optimizeExperiments,
});

const mapDispatchToProps = (dispatch: Dispatch<Action>) => ({
  onSuccess: () => { dispatch(paymentSuccess()); },
  onError: (error) => { dispatch(paymentFailure(error)); },
});

// ----- Functions ----- //

const getAmount = (formElements: Object) =>
  parseFloat(formElements.contributionAmount.value === 'other'
    ? formElements.contributionOther.value
    : formElements.contributionAmount.value);

// ----- Event handlers ----- //

let stripeReady = null;

const onSubmit = (e) => {
  e.preventDefault();

  const { elements } = e.target;
  const amount = getAmount(elements);
  const email = elements.namedItem('contributionEmail').value;

  if (stripeReady) {
    stripeReady.then(() => {
      openDialogBox(amount, email);
    });
  }
};


// ----- Render ----- //

function ContributionForm(props: PropTypes) {
  const {
    abParticipations,
    countryGroupId,
    selectedCountryGroupDetails,
    referrerAcquisitionData,
    optimizeExperiments,
    currency,
  } = props;

  let formElement = null;

  const thankYouRoute = `/${countryGroups[countryGroupId].supportInternationalisationId}/thankyou.new`;

  const callback = createTokenCallback({
    abParticipations,
    currencyId: currency,
    referrerAcquisitionData,
    optimizeExperiments,
    getData: () => { // eslint-disable-line consistent-return
      if (formElement) {
        const elements: any = formElement.elements; // eslint-disable-line prefer-destructuring
        const firstName = elements.contributionFirstName.value;
        const lastName = elements.contributionLastName.value;
        const email = elements.contributionEmail.value;
        const amount = getAmount(elements);

        return {
          user: {
            fullName: `${firstName} ${lastName}`,
            email,
          },
          amount,
        };
      }
    },
    onSuccess: () => {
      trackConversion(abParticipations, thankYouRoute);
      props.onSuccess();
    },
    onError: props.onError,
  });

  stripeReady = setupStripeCheckout(callback, null, currency, props.isTestUser);

  return props.done ?
    <Redirect to={thankYouRoute} />
    : (
      <div className="gu-content__content">
        <h1>{countryGroupSpecificDetails[countryGroupId].headerCopy}</h1>
        <p className="blurb">{countryGroupSpecificDetails[countryGroupId].contributeCopy}</p>
        <ErrorMessage message={props.error} />
        <form ref={(el) => { if (el) { formElement = el; } }} className={classNameWithModifiers('form', ['contribution'])} onSubmit={onSubmit}>
          <NewContributionType />
          <NewContributionAmount
            countryGroupId={countryGroupId}
            countryGroupDetails={selectedCountryGroupDetails}
            currency={currency}
          />
          <NewContributionTextInput id="contributionFirstName" name="contribution-fname" label="First Name" icon={<SvgUser />} required />
          <NewContributionTextInput id="contributionLastName" name="contribution-lname" label="Last Name" icon={<SvgUser />} required />
          <NewContributionTextInput
            id="contributionEmail"
            name="contribution-email"
            label="Email address"
            type="email"
            placeholder="example@domain.com"
            icon={<SvgEnvelope />}
            required
          />
          <NewContributionState countryGroupId={countryGroupId} />
          <NewContributionPayment />
          <NewContributionSubmit countryGroupId={countryGroupId} currency={currency} />
        </form>
      </div>
    );
}

ContributionForm.defaultProps = {
  done: false,
  error: null,
};

const NewContributionForm = connect(mapStateToProps, mapDispatchToProps)(ContributionForm);

export { NewContributionForm };
