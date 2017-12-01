// @flow

import uuidv4 from 'uuid';
import * as storage from 'helpers/storage';
import { Participations, getVariantsAsString } from 'helpers/abTests/abtest';
import { detect as detectCurrency } from 'helpers/internationalisation/currency';
import { getQueryParameter } from 'helpers/url';
import { detect as detectCountry } from 'helpers/internationalisation/country';
import { getOphanIds } from 'helpers/tracking/acquisitions';

// ----- Functions ----- //

function getDataValue(name, generator) {
  let value = storage.getSession(name);
  if (value === null) {
    value = generator();
    storage.setSession(name, value);
  }
  return value;
}

function getCurrency() {
  return detectCurrency(detectCountry()).iso;
}

function getContributionValue() {
  const param = getQueryParameter('contributionValue');
  if (param) {
    storage.setSession('contributionValue', String(parseInt(param, 10)));
  }
  return storage.getSession('contributionValue') || 0;
}

// ----- Exports ---//

export function init(participations: Participations) {
  window.googleTagManagerDataLayer = window.googleTagManagerDataLayer || [];

  window.googleTagManagerDataLayer.push({
    event: 'DataLayerReady',
    // orderId anonymously identifies this user in this session.
    // We need this to prevent page refreshes on conversion pages being
    // treated as new conversions
    orderId: getDataValue('orderId', uuidv4),
    currency: getDataValue('currency', getCurrency),
    value: getContributionValue(),
    paymentMethod: storage.getSession('paymentMethod'),
    campaignCodeBusinessUnit: getQueryParameter('CMP_BUNIT') || undefined,
    campaignCodeTeam: getQueryParameter('CMP_TU') || undefined,
    experience: getVariantsAsString(participations),
    ophanBrowserID: getOphanIds().browserId,
  });
}
