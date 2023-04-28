import PropTypes from 'prop-types';
import React from 'react';

import injectT from '../../i18n/injectT';
import tampereLogoSrc from './tampere-coat-of-arms.png';

function MunicipalityLogos({ t }) {
  return (
    <div className="app-MunicipalityLogos">
      <img alt={t('Logo.tampereAlt')} className="coat-of-arms" src={tampereLogoSrc} />
    </div>
  );
}

MunicipalityLogos.propTypes = {
  t: PropTypes.func.isRequired,
};

export default injectT(MunicipalityLogos);
