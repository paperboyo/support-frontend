// @flow

// ----- Imports ----- //

import ReactDOM from 'react-dom';
import React from 'react';

import Switchable from 'components/switchable/switchable';
import PaymentError from 'components/switchable/errorComponents/paymentError';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { Status } from 'helpers/settings';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { setup } from 'helpers/paymentIntegrations/newPaymentFlow/payPalExpressCheckout';
import type { PaymentAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { PayPalAuthorisation } from 'helpers/paymentIntegrations/newPaymentFlow/readerRevenueApis';
import type { PayPalExpressHandler } from 'helpers/checkouts';

// ---- Types ----- //

type PropTypes = {|
  amount: number,
  onPaymentAuthorisation: PaymentAuthorisation => void,
  csrf: CsrfState,
  currencyId: IsoCurrency,
  switchStatus: Status,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
  payPalExpressHandler: PayPalExpressHandler | null,
  formClass: string,
|};


// ----- Component ----- //

function PayPalExpressButton(props: PropTypes) {

  return (
    <Switchable
      status={props.switchStatus}
      component={() => <Button {...props} />}
      fallback={() => <PaymentError paymentMethod="PayPal" modifierClass="paypal-express" />}
    />
  );

}

// ----- Auxiliary Components ----- //

function Button(props: PropTypes) {

  const payPalHandler = props.payPalExpressHandler;
  if (!payPalHandler) {
    // PayPal's not loaded yet
    return null;
  }

  const tokenToAuthorisation = (token: string): PayPalAuthorisation => ({
    paymentMethod: 'PayPal',
    token,
  });

  const onPaymentAuthorisation = (token: string): void => {
    props.onPaymentAuthorisation(tokenToAuthorisation(token));
  };

  const payPalOptions = setup(
    props.amount,
    props.currencyId,
    props.csrf,
    onPaymentAuthorisation,
    props.canOpen,
    props.whenUnableToOpen,
    props.formClass,
  );

  const PayPalButton = payPalHandler && payPalHandler.Button.driver('react', { React, ReactDOM });

  return (
    <div id="component-paypal-button-checkout" className="component-paypal-button-checkout">
      <PayPalButton {...payPalOptions} />
    </div>
  );
}


// ----- Default Props ----- //

PayPalExpressButton.defaultProps = {
  switchStatus: 'On',
};


// ----- Export ----- //

export default PayPalExpressButton;
