// @flow

import React from 'react';

// A Visa logo.
export default function SvgVisaLogo() {

  return (
    <svg
      className="svg-visa-logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 36 24"
      aria-labelledby="svg-visa-logo-title"
    >
      <title id="svg-amex-logo-title">Visa</title>
      <defs>
        <rect id="a" width="35.25" height="23.25" rx="2.25" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a" />
        </mask>
        <use fill="#FFF" xlinkHref="#a" />
        <path fill="#193065" mask="url(#b)" d="M-18 5.357h57v-5.62h-57" />
        <path fill="#EFAC3C" mask="url(#b)" d="M-8.25 23.316H43.5v-5.102H-8.25" />
        <path d="M16.92 7.65l-1.574 8.29h-1.904l1.575-8.29h1.904zm8.014 5.354l1.003-3.113.577 3.114h-1.58zm2.126 2.937h1.76l-1.537-8.29h-1.625c-.366 0-.675.24-.81.61l-2.86 7.68h2l.398-1.237h2.443l.23 1.238zm-4.972-2.705c.008-2.188-2.686-2.31-2.668-3.287.006-.297.257-.613.808-.694.272-.04 1.025-.072 1.878.37l.334-1.758c-.458-.186-1.048-.366-1.782-.366-1.883 0-3.207 1.126-3.218 2.74-.012 1.194.946 1.86 1.667 2.256.742.407.99.668.988 1.03-.005.557-.593.803-1.14.812-.958.017-1.513-.29-1.956-.524l-.346 1.818c.446.23 1.267.43 2.117.44 2.003 0 3.312-1.114 3.318-2.837zm-7.89-5.584l-3.085 8.29H9.1L7.58 9.326c-.09-.407-.17-.556-.45-.728-.46-.28-1.215-.542-1.88-.705l.045-.24h3.24c.414 0 .785.31.88.844l.802 4.798 1.98-5.643H14.2z" fill="#193065" mask="url(#b)" />
      </g>
    </svg>
  );
}
