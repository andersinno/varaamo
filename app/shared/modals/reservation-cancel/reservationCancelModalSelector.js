import moment from 'moment';
import { createSelector, createStructuredSelector } from 'reselect';

import ActionTypes from '../../../constants/ActionTypes';
import ModalTypes from '../../../constants/ModalTypes';
import { isAdminSelector } from '../../../state/selectors/authSelectors';
import { createResourceSelector } from '../../../state/selectors/dataSelectors';
import modalIsOpenSelectorFactory from '../../../state/selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from '../../../state/selectors/factories/requestIsActiveSelectorFactory';
import { hasProducts } from '../../../utils/resourceUtils';

function reservationSelector(state) {
  return state.ui.reservations.toCancel[0] || {};
}

const resourceIdSelector = createSelector(
  reservationSelector,
  reservation => reservation.resource,
);

function userCanCancelReservation(resource, reservation) {
  const { cancellationMinDaysInAdvance, ownerCanCancelReservation } = resource;
  const { begin } = reservation;
  const cancellationDayisWithInRange = (
    moment.duration(moment(begin).diff(moment.now())).asDays() > cancellationMinDaysInAdvance
  );
  return ownerCanCancelReservation && cancellationDayisWithInRange;
}

const cancelAllowedSelector = createSelector(
  isAdminSelector,
  createResourceSelector(resourceIdSelector),
  reservationSelector,
  (isAdmin, resource, reservation) => {
    return (
      isAdmin
      || userCanCancelReservation(resource, reservation)
      || (!reservation.needManualConfirmation && !hasProducts(resource))
      || (reservation.state !== 'confirmed' && !hasProducts(resource))
    );
  },
);

const reservationCancelModalSelector = createStructuredSelector({
  cancelAllowed: cancelAllowedSelector,
  isCancellingReservations: requestIsActiveSelectorFactory(
    ActionTypes.API.RESERVATION_DELETE_REQUEST,
  ),
  reservation: reservationSelector,
  resource: createResourceSelector(resourceIdSelector),
  show: modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CANCEL),
});

export default reservationCancelModalSelector;
