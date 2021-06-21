import * as React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import Label from 'react-bootstrap/lib/Label';

import injectT from '../../../../../app/i18n/injectT';
import { RESERVATION_STATE } from '../../../../constants/ReservationState';

export const getLabelStyle = (status) => {
  switch (status) {
    case RESERVATION_STATE.CANCELLED:
      return 'default';
    case RESERVATION_STATE.CONFIRMED:
      return 'success';
    case RESERVATION_STATE.DENIED:
      return 'danger';
    case RESERVATION_STATE.REQUESTED:
      return 'warning';
    case RESERVATION_STATE.WAITING_FOR_PAYMENT:
      return 'warning';
    default:
      return '';
  }
};

export const getLabelText = (status, t) => {
  switch (status) {
    case RESERVATION_STATE.CANCELLED:
      return t('Reservation.stateLabelCancelled');
    case RESERVATION_STATE.CONFIRMED:
      return t('Reservation.stateLabelConfirmed');
    case RESERVATION_STATE.DENIED:
      return t('Reservation.stateLabelDenied');
    case RESERVATION_STATE.REQUESTED:
      return t('Reservation.stateLabelRequested');
    case RESERVATION_STATE.WAITING_FOR_PAYMENT:
      return t('Reservation.stateLabelWaitingForPayment');
    default:
      return '';
  }
};

const ManageReservationsStatus = ({ reservation, t }) => {
  const status = get(reservation, 'state', '');

  if (!status) {
    return null;
  }

  return (
    <div className="app-ManageReservationsStatus">
      <Label bsStyle={getLabelStyle(status)}>
        {getLabelText(status, t)}
      </Label>
    </div>
  );
};

ManageReservationsStatus.propTypes = {
  reservation: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ManageReservationsStatus);
