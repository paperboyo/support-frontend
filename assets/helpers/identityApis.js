// @flow
import { routes } from 'helpers/routes';
import { type Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { logPromise } from 'helpers/promise';
import { logException } from 'helpers/logger';
import { requestOptions } from 'helpers/fetch';

// ----- Types ----- //

// ----- Functions ----- //


function setPasswordGuest(
  password: string,
  guestAccountRegistrationToken: string,
  csrf: CsrfState,
): Promise<boolean> {

  const data = { password, guestAccountRegistrationToken };
  return logPromise(fetch(`${routes.contributionsSetPasswordGuest}`, requestOptions(data, 'same-origin', 'PUT', csrf)))
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      logException('/contribute/set-password-guest endpoint returned an error');
      return false;

    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false;
    });
}

function doesUserHavePassword(
  email: string,
  csrf: CsrfState,
): Promise<boolean> {

  return logPromise(fetch(`${routes.emailHasPassword}/${email}`, requestOptions({ email }, 'same-origin', 'GET', csrf)))
    .then((response) => {
      if (response.status === 200) {
        return true;
      }
      logException('/contribute/set-password-guest endpoint returned an error');
      return false;

    })
    .catch(() => {
      logException('Error while trying to interact with /contribute/set-password-guest');
      return false;
    });
}

export { setPasswordGuest, doesUserHavePassword };