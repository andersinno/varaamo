import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';
import kangasalaLogoSrc from './kangasala-coat-of-arms.png';
import lempaalaLogoSrc from './lempaala-coat-of-arms.png';
import nokiaLogoSrc from './nokia-coat-of-arms.png';
import orivesiLogoSrc from './orivesi-coat-of-arms.png';
import pirkkalaLogoSrc from './pirkkala-coat-of-arms.png';
import tampereLogoSrc from './tampere-coat-of-arms.png';
import vesilahtiLogoSrc from './vesilahti-coat-of-arms.png';
import ylojarviLogoSrc from './ylojarvi-coat-of-arms.png';

function MunicipalityLogos({ t }) {
  return (
    <div className="app-MunicipalityLogos">
      <img alt={t('Logo.kangasalaAlt')} className="coat-of-arms" src={kangasalaLogoSrc} />
      <img alt={t('Logo.lempaalaAlt')} className="coat-of-arms" src={lempaalaLogoSrc} />
      <img alt={t('Logo.nokiaAlt')} className="coat-of-arms" src={nokiaLogoSrc} />
      <img alt={t('Logo.orivesiAlt')} className="coat-of-arms" src={orivesiLogoSrc} />
      <img alt={t('Logo.pirkkalaAlt')} className="coat-of-arms" src={pirkkalaLogoSrc} />
      <img alt={t('Logo.tampereAlt')} className="coat-of-arms" src={tampereLogoSrc} />
      <img alt={t('Logo.vesilahtiAlt')} className="coat-of-arms" src={vesilahtiLogoSrc} />
      <img alt={t('Logo.ylojarviAlt')} className="coat-of-arms" src={ylojarviLogoSrc} />
    </div>
  );
}

MunicipalityLogos.propTypes = {
  t: PropTypes.func.isRequired
};

export default injectT(MunicipalityLogos);
