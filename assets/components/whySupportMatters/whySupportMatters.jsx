import React from 'react';
import PageSection from 'components/pageSection/pageSection';
import CtaLink from 'components/ctaLink/ctaLink';
import SvgChevronUp from 'components/svgs/chevronUp';

export default function WhySupportMatters() {
  return (
    <PageSection heading="Why your support matters" modifierClass="why-support-matters">
      <p>
        Unlike many news organisations, we have kept our journalism open to our global audience.
        We have not put up a paywall as we believe everyone deserves access to quality journalism,
        at a time when factual, honest reporting is critical.
      </p>
      <CtaLink
        text="See supporter options"
        url="#"
        accessibilityHint="See the options for becoming a supporter"
        svg={<SvgChevronUp />}
        modifierClasses={['see-supporter-options']}
      />
    </PageSection>
  )
}
