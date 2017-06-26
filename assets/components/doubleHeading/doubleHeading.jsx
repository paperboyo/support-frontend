// @flow

// ----- Imports ----- //

import React from 'react';
import { generateClassName } from 'helpers/utilities';


// ---- Types ----- //

type PropTypes = {
  heading: string,
  subheading: ?string,
  modifierClass?: string,
};


// ----- Component ----- //

export default function DoubleHeading(props: PropTypes) {

  const className = generateClassName('component-double-heading', props.modifierClass);

  const subhead = (
    <h2 className="component-double-heading__subheading">
      { props.subheading }
    </h2>
  );

  return (
    <div className={className}>
      <h1 className="component-double-heading__heading">
        { props.heading }
      </h1>
      { props.subheading ? subhead : '' }
    </div>
  );

}


// ----- Proptypes ----- //

DoubleHeading.defaultProps = {
  subheading: '',
  modifierClass: null,
};