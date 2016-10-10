import { createSelector } from 'reselect';

import ActionTypes from 'constants/ActionTypes';
import dateSelector from 'selectors/dateSelector';
import isAdminSelector from 'selectors/isAdminSelector';
import isLoggedInSelector from 'selectors/isLoggedInSelector';
import resourceSelector from 'selectors/resourceSelector';
import timeSelector from 'selectors/timeSelector';
import staffUnitsSelector from 'selectors/staffUnitsSelector';
import modalIsOpenSelectorFactory from 'selectors/factories/modalIsOpenSelectorFactory';
import requestIsActiveSelectorFactory from 'selectors/factories/requestIsActiveSelectorFactory';
import { getOpeningHours, getOpenReservations } from 'utils/resourceUtils';
import { getTimeSlots } from 'utils/timeUtils';
import ModalTypes from 'constants/ModalTypes';

const selectedSelector = (state) => state.ui.reservations.selected;
const toEditSelector = (state) => state.ui.reservations.toEdit;
const urlHashSelector = (state, props) => props.location.hash;

const reservationCalendarSelector = createSelector(
  isAdminSelector,
  isLoggedInSelector,
  modalIsOpenSelectorFactory(ModalTypes.RESERVATION_CONFIRM),
  requestIsActiveSelectorFactory(ActionTypes.API.RESERVATION_POST_REQUEST),
  requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  dateSelector,
  resourceSelector,
  selectedSelector,
  staffUnitsSelector,
  timeSelector,
  toEditSelector,
  urlHashSelector,
  (
    isAdmin,
    isLoggedIn,
    confirmReservationModalIsOpen,
    isMakingReservations,
    isFetchingResource,
    date,
    resource,
    selected,
    staffUnits,
    time,
    reservationsToEdit,
    urlHash
  ) => {
    const { closes, opens } = getOpeningHours(resource);
    const period = resource.minPeriod ? resource.minPeriod : undefined;
    const reservations = getOpenReservations(resource);
    const timeSlots = getTimeSlots(opens, closes, period, reservations, reservationsToEdit);

    return {
      date,
      isAdmin,
      isEditing: Boolean(reservationsToEdit.length),
      isFetchingResource,
      isLoggedIn,
      isMakingReservations,
      resource,
      selected,
      staffUnits,
      time,
      timeSlots,
      urlHash,
    };
  }
);

export default reservationCalendarSelector;
