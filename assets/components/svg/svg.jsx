// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Catalogue ----- //

type svgPath = {
  d: string,
  class: ?string,
};

type svg = {
  paths: svgPath[],
  viewBox: string,
};

const svgsCatalog: {
  'arrow-right-straight': svg,
  'guardian-titlepiece': svg,
} = {
  'arrow-right-straight': {
    viewBox: '0 0 20 17.89',
    paths: [
      {
        d: 'M20 9.35l-9.08 8.54-.86-.81 6.54-7.31H0V8.12h16.6L10.06.81l.86-.81L20 8.51v.84z',
        class: null,
      },
    ],
  },
  'guardian-titlepiece': {
    viewBox: '0 0 160 30',
    paths: [
      {
        d: 'M122.8.1c-1.5 0-2.7 1.2-2.7 2.7 0 1.5 1.2 2.7 2.7 2.7 1.5 0 2.7-1.2 2.7-2.7 0-1.5-1.2-2.7-2.7-2.7M142.5 22.1h8.3v-1.4l-1.6-.8v-9.8c.6-.4 1.3-.6 2.1-.6 1.4 0 2 .6 2 2.1V20l-1.6.8v1.4h8.3v-1.4l-1.7-.8v-9.4c0-2.8-1.3-4.1-3.8-4.1-2.1 0-4.1.7-5.4 2v-2h-.4l-6.3 1v1.3l1.7.8V20l-1.7.8v1.3zM118.9 7.4v1.4l1.8.8v10.3l-1.7.8v1.4h8.3v-1.4l-1.6-.8V6.4h-.4zM111.9 19.2c-.4.3-.8.5-1.5.5-2 0-3-1.6-3-5.4 0-4.3 1.2-5.7 2.8-5.7.9 0 1.3.3 1.7.7v9.9zm0-12c-.6-.4-1.6-.7-2.4-.7-3.7 0-7.3 2.1-7.3 8.3 0 5.8 3.6 7.7 5.9 7.7 1.9 0 3.2-.8 3.8-1.7h.2v1.6h.4l6-.7v-1.1l-1.6-.9V.3h-.4l-6.3 1v1.4l1.7.8v3.7z',
        class: 'guardian-titlepiece-0',
      },
      {
        d: 'M90.9 7.4v1.4l1.7.8v10.3l-1.6.8v1.4h8.8v-1.4l-2.1-.8v-8.1c.9-.7 2-.9 3.4-.9.4 0 1 .1 1.3.1V6.6c-.2-.1-.5-.1-.8-.1-1.7 0-3.2 1.1-4.1 3.1V6.4H97l-6.1 1zM80 8.6c.4-.2 1.1-.2 1.3-.2 2 0 2.5 1 2.5 2.9V13l-2.8.7c-3 .5-5.2 1.4-5.2 4.6 0 2.5 1.8 4.3 4.2 4.3 1.9 0 3.7-.8 4.4-2.2h.1c.2 1.6 1.7 2.1 3.2 2.1 1.2 0 2.4-.4 2.9-.9v-.9L89 20v-8.8c0-3.4-2.4-4.7-6.5-4.7-2.7 0-4.4.7-5.8 1.3v3.9H79l1-3.1zm3.9 10.5c-.3.4-.8.7-1.4.7-1 0-1.9-.5-1.9-2.2 0-1.2 1.1-2.3 2.3-2.5l1-.2v4.2zM131.4 8.6c.4-.2 1.1-.2 1.3-.2 2 0 2.5 1 2.5 2.9V13l-2.9.5c-3 .5-5.2 1.4-5.2 4.6 0 2.5 1.8 4.3 4.2 4.3 1.9 0 3.7-.8 4.4-2.2h.1c.2 1.6 1.7 2.1 3.2 2.1 1.2 0 2.4-.4 2.9-.9v-.9l-1.6-.8v-8.8c0-3.4-2.4-4.7-6.5-4.7-2.7 0-4.4.7-5.8 1.3v3.9h2.4l1-2.8zm3.9 10.5c-.3.4-.8.7-1.4.7-1 0-1.9-.5-1.9-2.2 0-1.2 1.1-2.3 2.3-2.5l1-.2v4.2z',
        class: 'guardian-titlepiece-0',
      },
      {
        d: 'M60.2 17.7c0 2.6 1.3 4.8 4.4 4.8 2 0 3.8-.9 4.8-2.1v2.1h.4l6.2-.7v-1.1l-1.7-.9V6.5h-.4l-6.3 1v1.4l1.7.8v9.1c-.6.4-1 .5-1.8.5-1.3 0-2.1-.4-2.1-2.1V6.5H65l-6.3 1v1.4l1.7.8-.2 8zM53.7 18.8h-5.4c-.6 0-1.1-.4-1.1-1 0-.4.3-.8.7-1.1.8.2 1.5.3 2.5.3 3.9 0 6.6-1.8 6.6-5.1 0-1.5-.6-2.3-1.6-3.2l2.6.8v-3l-4.1.8c-1-.4-2.3-.8-3.5-.8-3.9 0-6.6 2-6.6 5.3 0 2 1 3.5 2.5 4.3l.1.1c-.9.6-2.7 2-2.7 3.6 0 1.2.8 2.4 2.4 2.7-1.7.4-3.6 1.1-3.6 3.1s2.9 4.1 7.7 4.1c6 0 8.5-2.8 8.5-6.4.1-3.2-1.6-4.5-5-4.5M50.4 8.2c1.1 0 1.9.8 1.9 3.5 0 2.8-.8 3.4-1.9 3.4-1.1 0-1.9-.6-1.9-3.4.1-2.9.8-3.5 1.9-3.5m0 19c-2.8 0-3.8-1.1-3.7-2.1 0-.7.4-1.7 1.7-1.8h4.3c1.3 0 2 .9 2 1.7 0 1.6-1.2 2.2-4.3 2.2',
        class: 'guardian-titlepiece-0',
      },
      {
        d: 'M42.2 15c0-6.4-2.8-8.5-6.8-8.5-4.5 0-7.5 3-7.5 8 0 5.2 2.7 8 7.9 8 2.8 0 5-1.5 5.7-2.5l.1-1.2c-1.1.3-2.1.5-4.1.5-2.8 0-4.4-1.4-4.4-4.4l9.1.1zm-6.8-6.8c1.3 0 1.9.9 1.9 4.7l-4.2.2c0-3.8.9-4.9 2.3-4.9',
        class: 'guardian-titlepiece-1',
      },
      {
        d: 'M11.4 22.1h8.3v-1.4l-1.5-.7v-9.8c.6-.4 1.3-.6 2.1-.6 1.4 0 2.1.9 2 2.2V20l-1.6.8v1.4H29v-1.4l-1.7-.8v-9.4c0-2.8-1.6-4.1-3.8-4.1-2.1 0-4.1.7-5.4 2V0h-.4l-6.3 1v1.3l1.7.8V20l-1.7.8v1.3zM2.3 17.9c0 2.8 1.3 4.6 4.3 4.6 1.6 0 3.3-.4 4.2-1.1v-1.9c-.4.1-1.1.2-1.6.2-1.5 0-1.9-.8-1.9-2.3v-8h3.3V6.9H7.4V3.3L2.3 4v2.9L0 7.3v2.2h2.3v8.4z',
        class: 'guardian-titlepiece-1',
      },
    ],
  },
};


// ----- Types ----- //

// Utility type: https://flow.org/en/docs/types/utilities/#toc-keys
export type svgName = $Keys<typeof svgsCatalog>;

type PropTypes = {
  svgName: svgName,
};


// ----- Component ----- //

const Svg = (props: PropTypes) => {

  const svgClass = `svg-${props.svgName}`;

  const paths = svgsCatalog[props.svgName].paths.map(path =>
    <path d={path.d} className={path.class} />,
  );

  return (
    <svg
      className={svgClass}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={svgsCatalog[props.svgName].viewBox}
    >
      {paths}
    </svg>
  );

};


// ----- Exports ----- //

export default Svg;
