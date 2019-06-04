import PropTypes from 'prop-types';
import React from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import iconMapMarker from 'hel-icons/dist/shapes/map-marker.svg';
import upperFirst from 'lodash/upperFirst';

import { injectT } from 'i18n';

function formatAddress({ addressZip, municipality, streetAddress }) {
  const parts = [streetAddress, `${addressZip} ${upperFirst(municipality)}`.trim()];
  return parts.filter(part => part).join(', ');
}

function ResourceMapInfo({ unit, t }) {
  return (
    <div className="app-ResourceMapInfo">
      <Grid>
        {unit && (
          <div className="app-ResourceMapInfo__content">
            <img
              alt={t('ResourceInfo.serviceMapLink')}
              className="app-ResourceMapInfo__icon"
              src={iconMapMarker}
            />
            <span>{formatAddress(unit)}</span>
          </div>
        )}
      </Grid>
    </div>
  );
}

ResourceMapInfo.propTypes = {
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceMapInfo = injectT(ResourceMapInfo); // eslint-disable-line

export default ResourceMapInfo;
