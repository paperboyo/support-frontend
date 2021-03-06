// @flow

// ----- Imports ----- //
import React, { Component } from 'react';
import { addLeadingZeros } from 'helpers/utilities';


// ---- Types ----- //
type CountdownTime = {
  unixTimeLeft: number,
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

type PropTypes = {
  to: number,
  legend?: string
};

type StateTypes = {
  time: CountdownTime
}


// ---- Helpers ----- //
const calculateCountdown = (endDate: number): CountdownTime => {
  const unixTimeLeft = endDate - Date.now();

  const seconds = Math.floor((unixTimeLeft / 1000) % 60);
  const minutes = Math.floor((unixTimeLeft / 1000 / 60) % 60);
  const hours = Math.floor((unixTimeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(unixTimeLeft / (1000 * 60 * 60 * 24));

  return {
    unixTimeLeft, seconds, minutes, hours, days,
  };
};

const nonNegative = (number: number): number => (number > 0 ? number : 0);


// ----- Component ----- //
export default class Countdown extends Component<PropTypes, StateTypes> {

  static defaultProps = {
    legend: null,
  };

  constructor(props: PropTypes) {
    super(props);

    this.state = {
      time: calculateCountdown(this.props.to),
    };
  }

  componentDidMount(): void {
    this.interval = setInterval(() => {
      const time = calculateCountdown(this.props.to);
      if (time.unixTimeLeft >= 0) { this.setState({ time }); } else { this.stop(); }
    }, 1000);
  }

  componentWillUnmount(): void {
    this.stop();
  }

  interval: IntervalID;

  stop(): void {
    clearInterval(this.interval);
  }

  render() {
    const {
      days, hours, minutes, seconds,
    } = this.state.time;

    const { legend } = this.props;

    const chip = (description: string, time: number) => (
      <span className="component-countdown__chip">
        <span className="component-countdown__time">{addLeadingZeros(nonNegative((time)), 2)}</span>
        <span className="component-countdown__description">{description}</span>
      </span>
    );

    return (
      <time className="component-countdown">
        {days > 0 && chip('days', days)}
        {chip('hrs', hours)}
        {chip('mins', minutes)}
        {chip('secs', seconds)}
        {legend &&
          <span className="component-countdown__chip component-countdown__chip--legend">
            <span className="component-countdown__description">{legend}</span>
          </span>
        }
      </time>
    );
  }
}
