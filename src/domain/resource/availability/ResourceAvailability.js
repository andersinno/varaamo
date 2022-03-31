import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import Label from '../../../../app/shared/label/Label';
import injectT from '../../../../app/i18n/injectT';
import * as resourceUtils from '../utils';

const ResourceAvailability = ({ date, resource, t }) => {
  const now = moment();
  if (moment(date).isBefore(now, 'day')) {
    return <span />;
  }

  if (!resource.reservable && resource.can_use_without_reservation) {
    return (
      <Label bsStyle="primary" className="resource-availability">
        {t('ResourceAvailability.canUseWithoutReservation')}
      </Label>
    );
  }

  if (resource.external_reservation_url || resource.external_reservation_text) {
    return (
      <Label bsStyle="primary" className="resource-availability">
        {t('ResourceAvailability.externalReservation')}
      </Label>
    );
  }

  if (resource.temporarily_closed) {
    return (
      <Label bsStyle="danger" className="resource-availability">
        {t('ResourceAvailability.temporarilyClosed')}
      </Label>
    );
  }

  const availabilityData = moment(date).isSame(now, 'day')
    ? resourceUtils.getAvailabilityDataForNow(resource, date)
    : resourceUtils.getAvailabilityDataForWholeDay(resource, date);

  return (
    <Label bsStyle={availabilityData.bsStyle} className="resource-availability">
      {t(`ResourceAvailability.${availabilityData.status}`, availabilityData.values)}
    </Label>
  );
};

ResourceAvailability.propTypes = {
  date: PropTypes.string.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceAvailability);
