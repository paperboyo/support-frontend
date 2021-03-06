// @flow

// ----- Imports ----- //

import type { Action } from './marketingConsentActions';


// ----- Types ----- //

export type State = {
  error: boolean,
  confirmOptIn: ?boolean,
};


// ----- Setup ----- //

const initialState: State = {
  error: false,
  confirmOptIn: null,
};


// ----- Reducer ----- //

function marketingConsentReducerFor(scope: string): Function {

  const marketingConsentReducer = (state: State = initialState, action: Action): State => {

    if (action.scope !== scope) {
      return state;
    }

    switch (action.type) {
      case 'SET_API_ERROR':
        return { ...state, error: action.error };

      case 'SET_CONFIRM_MARKETING_CONSENT':
        return { ...state, confirmOptIn: action.confirmOptIn };

      default:
        return state;
    }
  };

  return marketingConsentReducer;
}


// ----- Exports ----- //

export { marketingConsentReducerFor };
