// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { type Contrib } from 'helpers/contributions';
import { classNameWithModifiers } from 'helpers/utilities';

import SvgPasswordKey from 'components/svgs/passwordKey';
import SvgEnvelope from 'components/svgs/envelope';
import CtaLink from 'components/ctaLink/ctaLink';
import { setPasswordGuest } from 'components/setPassword/helper';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { NewContributionTextInput } from '../ContributionTextInput';
import { CreateAccountButton } from './CreateAccountButton';
import { type ThankYouPageStage } from '../../contributionsLandingReducer';
import { setThankYouPageStage } from '../../contributionsLandingActions';
import type { Action } from '../../../oneoff-contributions/helpers/checkoutForm/checkoutFormActions';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  contributionType: Contrib,
  email: string,
  guestAccountCreationToken: string,
  setThankYouPageStage: (ThankYouPageStage) => void,
  csrf: CsrfState,
};
/* eslint-enable react/no-unused-prop-types */

const mapStateToProps = state => ({
  contributionType: state.page.form.contributionType,
  email: state.page.form.formData.email,
  guestAccountCreationToken: state.page.form.guestAccountCreationToken,
  csrf: state.page.csrf,
});

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    setThankYouPageStage: (thankYouPageStage: ThankYouPageStage) => {
      dispatch(setThankYouPageStage(thankYouPageStage));
    }
  }
}


function onSubmit(props: PropTypes): Event => void {
  return (event) => {
    event.preventDefault();

    if (!(event.target: any).checkValidity()) {
      return;
    }

    const password = document.getElementById('password').value;
    setPasswordGuest(password, props.guestAccountCreationToken, props.csrf)
    .then(response => {
       if (response === true){
         props.setThankYouPageStage('thankYou')
       } else {
         props.setThankYouPageStage('thankYou')
      }
    });
  };
}


// ----- Render ----- //

function SetPassword(props: PropTypes) {
  return (<div className="set-password__container">
      <h1 className="header">Set up a free account to manage your payments</h1>
      <section className="set-password">
        <p className="set-password__standfirst">
          Thank you for a valuable contribution. As a contributor, being signed in means you will no
          longer see the “Since you’re here …” messages asking you to contribute to our journalism.
        </p>
        <form onSubmit={onSubmit(props)} className={classNameWithModifiers('form', ['contribution'])} noValidate>
          <NewContributionTextInput
            id="email"
            name="contribution-email"
            label="Email address"
            value={props.email}
            icon={<SvgEnvelope />}
            autoComplete="off"
            autoCapitalize="words"
            required
            disabled
          />
          <NewContributionTextInput
            id="password"
            type="password"
            name="contribution-password"
            label="Set a password"
            icon={<SvgPasswordKey />}
            autoComplete="off"
            autoCapitalize="words"
            required
          />
          <CreateAccountButton/>
          <CtaLink
            text="No, thank you"
            accessibilityHint="no thank you"
            id="qa-no-thankyou"
            onClick={() => { props.setThankYouPageStage('thankYou')}}
            modifierClasses={['form-navigation', 'no-thanks']}
          />
        </form>
      </section>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(SetPassword);
