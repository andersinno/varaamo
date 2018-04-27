import React, { PropTypes } from 'react';

import { injectT } from 'i18n';
import { getCurrentCustomization } from 'utils/customizationUtils';
import helsinkiLogoSrc from './helsinki-logo-white.png';
import espooLogoSrc from './espoo-logo.png';
import vantaaLogoSrc from './vantaa-logo.png';
// Tampere logos
import kangasalaLogoSrc from './kangasala-coat-of-arms.png';
import lempaalaLogoSrc from './lempaala-coat-of-arms.png';
import nokiaLogoSrc from './nokia-coat-of-arms.png';
import orivesiLogoSrc from './orivesi-coat-of-arms.png';
import pirkkalaLogoSrc from './pirkkala-coat-of-arms.png';
import tampereLogoSrc from './tampere-coat-of-arms.png';
import vesilahtiLogoSrc from './vesilahti-coat-of-arms.png';
import ylojarviLogoSrc from './ylojarvi-coat-of-arms.png';

function Logo({ t }) {
  switch (getCurrentCustomization()) {

    case 'ESPOO': {
      return (
        <img
          alt={t('Logo.espooAlt')}
          src={espooLogoSrc}
        />
      );
    }

    case 'VANTAA': {
      return (
        <img
          alt={t('Logo.vantaaAlt')}
          src={vantaaLogoSrc}
        />
      );
    }

    case 'TAMPERE': {
      return (
        <div>
          <img
            alt={t('Logo.kangasalaAlt')}
            src={kangasalaLogoSrc}
          />
          <img
            alt={t('Logo.lempaalaAlt')}
            src={lempaalaLogoSrc}
          />
          <img
            alt={t('Logo.nokiaAlt')}
            src={nokiaLogoSrc}
          />
          <img
            alt={t('Logo.orivesiAlt')}
            src={orivesiLogoSrc}
          />
          <img
            alt={t('Logo.pirkkalaAlt')}
            src={pirkkalaLogoSrc}
          />
          <img
            alt={t('Logo.tampereAlt')}
            src={tampereLogoSrc}
          />
          <img
            alt={t('Logo.vesilahtiAlt')}
            src={vesilahtiLogoSrc}
          />
          <img
            alt={t('Logo.ylojarviAlt')}
            src={ylojarviLogoSrc}
          />
        </div>
      );
    }

    default: {
      return (
        <img
          alt={t('Logo.helsinkiAlt')}
          src={helsinkiLogoSrc}
        />
      );
    }
  }
}

Logo.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(Logo);
