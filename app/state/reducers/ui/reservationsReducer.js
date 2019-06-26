import types from 'constants/ActionTypes';
import ModalTypes from 'constants/ModalTypes';

import isEmpty from 'lodash/isEmpty';
import first from 'lodash/first';
import last from 'lodash/last';
import Immutable from 'seamless-immutable';


import { getTimeSlots, getEndTimeSlotWithMinPeriod, getTimeDiff } from 'utils/timeUtils';

const initialState = Immutable({
  adminReservationFilters: {
    state: 'all',
  },
  failed: [],
  selected: [],
  selectedSlot: null,
  toCancel: [],
  toEdit: [],
  toShow: [],
  toShowEdited: [],
});

function selectReservationToEdit(state, action) {
  const { slotSize, reservation } = action.payload;
  const slots = getTimeSlots(reservation.begin, reservation.end, slotSize);
  const firstSlot = first(slots);
  const selected = [
    {
      begin: firstSlot.start,
      end: firstSlot.end,
      resource: reservation.resource,
    },
  ];
  if (slots.length > 1) {
    const lastSlot = last(slots);
    selected.push({
      begin: lastSlot.start,
      end: lastSlot.end,
      resource: reservation.resource,
    });
  }
  return state.merge({
    selected,
    toEdit: [reservation],
  });
}

function parseError(error) {
  if (error.response && error.response.non_field_errors && error.response.non_field_errors.length) {
    return error.response.non_field_errors
      .join('. ')
      .replace("['", '')
      .replace("']", '');
  } if (error.response && error.response.detail) {
    return error.response.detail;
  }
  return 'Jotain meni vikaan';
}

function reservationsReducer(state = initialState, action) {
  switch (action.type) {
    case types.API.RESERVATION_POST_SUCCESS: {
      return state.merge({
        selected: [],
        toEdit: [],
        toShow: [...state.toShow, action.payload],
      });
    }

    case types.API.RESERVATION_POST_ERROR: {
      const reservation = action.meta.reservation;
      const failReason = parseError(action.payload);
      return state.merge({
        failed: [...state.failed, { ...reservation, failReason }],
      });
    }

    case types.API.RESERVATION_PUT_SUCCESS: {
      return state.merge({
        selected: [],
        toEdit: [],
        toShow: [],
        toShowEdited: [...state.toShowEdited, action.payload],
      });
    }

    case types.UI.CANCEL_RESERVATION_EDIT: {
      return state.merge({
        selected: [],
        toEdit: [],
      });
    }

    case types.UI.CHANGE_ADMIN_RESERVATIONS_FILTERS: {
      const adminReservationFilters = action.payload;
      return state.merge({ adminReservationFilters }, { deep: true });
    }

    case types.UI.CLEAR_RESERVATIONS: {
      return initialState;
    }

    case types.UI.CLOSE_MODAL: {
      const modal = action.payload;
      if (modal === ModalTypes.RESERVATION_CANCEL) {
        return state.merge({ toCancel: [] });
      }
      if (modal === ModalTypes.RESERVATION_COMMENT) {
        return state.merge({ toShow: [] });
      }
      if (modal === ModalTypes.RESERVATION_SUCCESS) {
        return state.merge({ failed: [], toShow: [] });
      }
      return state;
    }

    case types.UI.SELECT_RESERVATION_TO_CANCEL: {
      return state.merge({ toCancel: [...state.toCancel, action.payload] });
    }

    case types.UI.SELECT_RESERVATION_TO_EDIT: {
      return selectReservationToEdit(state, action);
    }

    case types.UI.SELECT_RESERVATION_SLOT: {
      return state.merge({ selectedSlot: action.payload });
    }

    case types.UI.SELECT_RESERVATION_TO_SHOW: {
      return state.merge({ toShow: [...state.toShow, action.payload] });
    }

    case types.UI.TOGGLE_TIME_SLOT: {
      const { minPeriod, slotSize, id } = action.payload.resource;

      let minPeriodSlot;

      const startSlot = {
        begin: action.payload.begin,
        end: action.payload.end,
        resource: id
      };
      // Remove minPeriod of slot information from payload.
      // startSlot is known as input slot from payload.

      if (isEmpty(state.selected)) {
        // No time slot have been selected.
        // auto append minPeriodSlot to selected state to make sure minPeriod time is selected.
        // If minPeriod exist
        minPeriodSlot = minPeriod && getEndTimeSlotWithMinPeriod(startSlot, minPeriod, slotSize);

        return state.merge({ selected: minPeriod ? [startSlot, minPeriodSlot] : [startSlot] });
      }

      if (!minPeriod) {
        // no minPeriod, make startSlot as end timeslot

        return state.merge({ selected: [state.selected[0], startSlot] });
      }

      // startSlot > minPeriodSlot => payload slot is larger than minPeriod
      // startSlot === minPeriodSlot => make one of them as end timeslot
      // startSlot < minPeriodSlot => keep minPeriod as selected.
      minPeriodSlot = getEndTimeSlotWithMinPeriod(state.selected[0], minPeriod, slotSize);
      const timeDiff = getTimeDiff(startSlot.begin, minPeriodSlot.begin);

      return state.merge({
        selected: [state.selected[0],
          timeDiff > 0 ? startSlot : minPeriodSlot]
      });
    }

    case types.UI.CLEAR_TIME_SLOTS: {
      return state.merge({
        selected: [],
      });
    }

    default: {
      return state;
    }
  }
}

export default reservationsReducer;
