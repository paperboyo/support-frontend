// @flow

// ----- Imports ----- //

import React from 'react';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';
import CirclesIntroduction from 'components/circlesIntroduction/circlesIntroduction';
import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import WhySupport from 'components/whySupport/whySupport';
import PatronsEvents from 'components/patronsEvents/patronsEvents';

import { renderPage } from 'helpers/render';


// ----- Render ----- //

const content = (
  <div>
    <SimpleHeader />
    <CirclesIntroduction />
    <ThreeSubscriptions />
    <WhySupport />
    <PatronsEvents />
    <Footer />
  </div>
);

renderPage(content, 'support-landing-page');
