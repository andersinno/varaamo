import types from 'constants/ActionTypes';
import { DEFAULT_SLOT_SIZE } from 'constants/SlotConstants';

import { createAction } from 'redux-actions';
import Immutable from 'seamless-immutable';
import first from 'lodash/first';
import last from 'lodash/last';


import {
  cancelReservationEdit,
  changeAdminReservationFilters,
  clearReservations,
  clearTimeSlots,
  closeReservationCancelModal,
  closeReservationCommentModal,
  closeReservationSuccessModal,
  selectReservationSlot,
  selectReservationToCancel,
  selectReservationToEdit,
  selectReservationToShow,
  toggleTimeSlot,
} from 'actions/uiActions';
import Reservation from 'utils/fixtures/Reservation';
import { getTimeSlots } from 'utils/timeUtils';
import reservationsReducer from './reservationsReducer';

describe('state/reducers/ui/reservationsReducer', () => {
  describe('initial state', () => {
    const initialState = reservationsReducer(undefined, {});

    describe('adminReservationFilters', () => {
      test('is an object', () => {
        expect(typeof initialState.adminReservationFilters).toBe('object');
      });

      test('state is "all"', () => {
        expect(initialState.adminReservationFilters.state).toBe('all');
      });
    });

    test('failed is an empty array', () => {
      expect(initialState.failed).toEqual([]);
    });

    test('selected is an empty array', () => {
      expect(initialState.selected).toEqual([]);
    });

    test('selectedSlot is null', () => {
      expect(initialState.selectedSlot).toBeNull();
    });

    test('toCancel is an empty array', () => {
      expect(initialState.toCancel).toEqual([]);
    });

    test('toEdit is an empty array', () => {
      expect(initialState.toEdit).toEqual([]);
    });

    test('toShow is an empty array', () => {
      expect(initialState.toShow).toEqual([]);
    });

    test('toShowEdited is an empty array', () => {
      expect(initialState.toShowEdited).toEqual([]);
    });
  });

  describe('handling actions', () => {
    describe('API.RESERVATION_POST_SUCCESS', () => {
      const postReservationSuccess = createAction(types.API.RESERVATION_POST_SUCCESS);

      test('clears selected', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          selected: ['some-selected'],
          toShow: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.selected).toEqual([]);
      });

      test('clears the toEdit', () => {
        const action = postReservationSuccess();
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
          toShow: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).toEqual([]);
      });

      test('adds the given reservation to toShow', () => {
        const initialState = Immutable({
          toShow: [],
        });
        const reservation = Reservation.build();
        const action = postReservationSuccess(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toShow).toEqual(expected);
      });

      test('does not affect other reservations in toShow', () => {
        const reservations = [Reservation.build(), Reservation.build()];
        const initialState = Immutable({
          toShow: [reservations[0]],
        });
        const action = postReservationSuccess(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toShow).toEqual(expected);
      });
    });

    describe('API.RESERVATION_POST_ERROR', () => {
      const failReason = 'Some error';
      const postReservationError = createAction(
        types.API.RESERVATION_POST_ERROR,
        () => ({ response: { non_field_errors: [`['${failReason}']`] } }),
        reservation => ({ reservation })
      );

      test('adds the reservation in meta info to failed', () => {
        const initialState = Immutable({
          failed: [],
        });
        const reservation = Reservation.build();
        const action = postReservationError(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([{ ...reservation, failReason }]);

        expect(nextState.failed).toEqual(expected);
      });

      test('does not affect other reservations in failed', () => {
        const reservations = [Reservation.build(), Reservation.build()];
        const initialState = Immutable({
          failed: [reservations[0]],
        });
        const action = postReservationError(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], { ...reservations[1], failReason }]);

        expect(nextState.failed).toEqual(expected);
      });
    });

    describe('API.RESERVATION_PUT_SUCCESS', () => {
      const reservation = Reservation.build();
      const putReservationSuccess = createAction(types.API.RESERVATION_PUT_SUCCESS);

      test('clears selected', () => {
        const action = putReservationSuccess(reservation);
        const initialState = Immutable({
          selected: ['some-selected'],
          toShowEdited: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.selected).toEqual([]);
      });

      test('clears the toEdit', () => {
        const action = putReservationSuccess(reservation);
        const initialState = Immutable({
          toEdit: ['something-to-edit'],
          toShowEdited: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).toEqual([]);
      });

      test('clears the toShow', () => {
        const action = putReservationSuccess(reservation);
        const initialState = Immutable({
          toShow: ['something-to-show'],
          toShowEdited: [],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toShow).toEqual([]);
      });

      test('adds the reservation in toShowEdited', () => {
        const action = putReservationSuccess(reservation);
        const initialState = Immutable({
          toShowEdited: [],
        });
        const expected = Immutable([reservation]);
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toShowEdited).toEqual(expected);
      });
    });

    describe('UI.CANCEL_RESERVATION_EDIT', () => {
      test('clears toEdit array', () => {
        const initialState = Immutable({
          toEdit: [Reservation.build()],
        });
        const action = cancelReservationEdit();
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.toEdit).toEqual([]);
      });
    });

    describe('UI.CHANGE_ADMIN_RESERVATIONS_FILTERS', () => {
      test('sets the given filters to adminReservationFilters', () => {
        const adminReservationFilters = { state: 'some-state' };
        const action = changeAdminReservationFilters(adminReservationFilters);
        const initialState = Immutable({
          adminReservationFilters: {},
        });
        const expected = Immutable(adminReservationFilters);
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationFilters).toEqual(expected);
      });

      test('overrides previous values of same adminReservationFilters', () => {
        const adminReservationFilters = { state: 'some-state' };
        const action = changeAdminReservationFilters(adminReservationFilters);
        const initialState = Immutable({
          adminReservationFilters: { state: 'old-value' },
        });
        const expected = Immutable(adminReservationFilters);
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationFilters).toEqual(expected);
      });

      test('does not override unspecified adminReservationFilters', () => {
        const adminReservationFilters = { state: 'some-state' };
        const action = changeAdminReservationFilters(adminReservationFilters);
        const initialState = Immutable({
          adminReservationFilters: { otherFilter: 'other-value' },
        });
        const expected = Immutable({
          otherFilter: 'other-value',
          state: 'some-state',
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState.adminReservationFilters).toEqual(expected);
      });
    });

    describe('UI.CLEAR_RESERVATIONS', () => {
      test('sets the given date to date', () => {
        const resetedState = reservationsReducer(undefined, {});
        const action = clearReservations();
        const initialState = Immutable({
          date: '2015-11-11',
          selected: ['something'],
          toCancel: ['something'],
          toEdit: ['something'],
          toShow: ['something'],
        });
        const nextState = reservationsReducer(initialState, action);

        expect(nextState).toEqual(resetedState);
      });
    });

    describe('UI.CLOSE_MODAL', () => {
      describe('if closed modal is RESERVATION_CANCEL modal', () => {
        test('clears toCancel array', () => {
          const initialState = Immutable({
            toCancel: [Reservation.build()],
          });
          const action = closeReservationCancelModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toCancel).toEqual([]);
        });
      });

      describe('if closed modal is RESERVATION_COMMENT modal', () => {
        test('clears toShow array', () => {
          const initialState = Immutable({
            toShow: [Reservation.build()],
          });
          const action = closeReservationCommentModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toShow).toEqual([]);
        });
      });

      describe('if closed modal is RESERVATION_SUCCESS modal', () => {
        test('clears toShow array', () => {
          const initialState = Immutable({
            toShow: [Reservation.build()],
          });
          const action = closeReservationSuccessModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.toShow).toEqual([]);
        });

        test('clears failed array', () => {
          const initialState = Immutable({
            failed: [Reservation.build()],
          });
          const action = closeReservationSuccessModal();
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.failed).toEqual([]);
        });
      });
    });

    describe('UI.SELECT_RESERVATION_SLOT', () => {
      test('sets the given slot to state', () => {
        const initialState = Immutable({
          selectedSlot: { old: 'slot' },
        });
        const newSlot = { new: 'slot' };
        const action = selectReservationSlot(newSlot);
        const nextState = reservationsReducer(initialState, action);
        expect(nextState.selectedSlot).toEqual(newSlot);
      });
    });

    describe('UI.SELECT_RESERVATION_TO_CANCEL', () => {
      test('adds the given reservation to toCancel', () => {
        const initialState = Immutable({
          toCancel: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToCancel(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toCancel).toEqual(expected);
      });

      test('does not affect other reservations in toCancel', () => {
        const reservations = [Reservation.build(), Reservation.build()];
        const initialState = Immutable({
          toCancel: [reservations[0]],
        });
        const action = selectReservationToCancel(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toCancel).toEqual(expected);
      });
    });

    describe('UI.SELECT_RESERVATION_TO_EDIT', () => {
      test('sets the given reservation to toEdit', () => {
        const initialState = Immutable({
          selected: [],
          toEdit: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToEdit({ reservation });
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toEdit).toEqual(expected);
      });

      test('removes other reservations in toEdit', () => {
        const reservations = [Reservation.build(), Reservation.build()];
        const initialState = Immutable({
          selected: [],
          toEdit: [reservations[0]],
        });
        const action = selectReservationToEdit({ reservation: reservations[1] });
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[1]]);

        expect(nextState.toEdit).toEqual(expected);
      });

      test('splits the given reservation to slots and add to selected', () => {
        const begin = '2015-10-09T08:00:00+03:00';
        const end = '2015-10-09T10:00:00+03:00';
        const slotSize = DEFAULT_SLOT_SIZE;
        const reservation = Reservation.build({ begin, end });
        const initialState = Immutable({
          selected: [],
          toEdit: [],
        });
        const action = selectReservationToEdit({ reservation, slotSize });
        const nextState = reservationsReducer(initialState, action);
        const slots = getTimeSlots(reservation.begin, reservation.end, slotSize);
        const firstSlot = first(slots);
        const lastSlot = last(slots);
        const expected = [
          {
            begin: firstSlot.start,
            end: firstSlot.end,
            resource: reservation.resource,
          },
          {
            begin: lastSlot.start,
            end: lastSlot.end,
            resource: reservation.resource,
          },
        ];

        expect(nextState.selected).toEqual(expected);
      });
    });

    describe('UI.SELECT_RESERVATION_TO_SHOW', () => {
      test('adds the given reservation to toShow', () => {
        const initialState = Immutable({
          toShow: [],
        });
        const reservation = Reservation.build();
        const action = selectReservationToShow(reservation);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservation]);

        expect(nextState.toShow).toEqual(expected);
      });

      test('does not affect other reservations in toShow', () => {
        const reservations = [Reservation.build(), Reservation.build()];
        const initialState = Immutable({
          toShow: [reservations[0]],
        });
        const action = selectReservationToShow(reservations[1]);
        const nextState = reservationsReducer(initialState, action);
        const expected = Immutable([reservations[0], reservations[1]]);

        expect(nextState.toShow).toEqual(expected);
      });
    });

    describe('UI.TOGGLE_TIME_SLOT', () => {
      describe('minPeriod', () => {
        test('from payload is omit from slot data, add start slot to selected normally if minPeriod is undefined', () => {
          const initialState = Immutable({
            selected: [],
          });

          const payload = {
            begin: '2015-10-11T10:00:00Z',
            end: '2015-10-11T11:00:00Z',
            resource: {
              id: 'some-resource'
            },
          };

          const expected = Immutable([{
            begin: '2015-10-11T10:00:00Z',
            end: '2015-10-11T11:00:00Z',
            resource: 'some-resource'
          }

          ]);
          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);

          expect(nextState.selected).toEqual(expected);
          expect(expected).not.toHaveProperty('minPeriod');
        });

        test('auto populate start time slot with end time slot, range between equal minPeriod', () => {
          const initialState = Immutable({
            selected: []
          });
          const minPeriod = '02:00:00';

          const payload = {
            begin: '2019-05-09T05:00:00.000Z',
            end: '2019-05-09T06:00:00.000Z',
            resource: {
              id: 'some-resource',
              minPeriod,
              slotSize: '01:00:00'
            },
          };

          const startTimeSlot = {
            begin: '2019-05-09T05:00:00.000Z',
            end: '2019-05-09T06:00:00.000Z',
            resource: 'some-resource'
          };

          const expectedEndSlot = {
            begin: '2019-05-09T06:00:00.000Z',
            end: '2019-05-09T07:00:00.000Z',
            resource: 'some-resource',
          };
          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([startTimeSlot, expectedEndSlot]);

          expect(nextState.selected).toEqual(expected);
        });

        test('push new end time slot if its larger than current end time slot', () => {
          const newEndTimeSlot = {
            begin: '2019-05-09T08:00:00.000Z',
            end: '2019-05-09T09:00:00.000Z',
            resource: 'some-resource',
          };

          const originalStartTimeSlot = {
            begin: '2019-05-09T05:00:00.000Z',
            end: '2019-05-09T06:00:00.000Z',
            resource: 'some-resource',
          };

          const initialState = Immutable({
            selected: [
              originalStartTimeSlot,
              {
                begin: '2019-05-09T06:00:00.000Z',
                end: '2019-05-09T07:00:00.000Z',
                resource: 'some-resource',
              },
            ]
          });
          const minPeriod = '01:00:00';

          const payload = {
            ...newEndTimeSlot,
            resource: {
              id: 'some-resource',
              minPeriod
            }
          };

          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([originalStartTimeSlot, newEndTimeSlot]);

          expect(nextState.selected).toEqual(expected);
        });

        test('in case new end time is less than minPeriod, keep end time slot to minPeriod', () => {
          const minPeriod = '03:00:00';

          const newEndTimeSlot = {
            begin: '2019-05-09T06:00:00.000Z',
            end: '2019-05-09T07:00:00.000Z',
            resource: 'some-resource',
          };
          // 1h diff from original start time slot. 2h is minPeriod, not allowed to change

          const originalStartTimeSlot = {
            begin: '2019-05-09T05:00:00.000Z',
            end: '2019-05-09T06:00:00.000Z',
            resource: 'some-resource',
          };

          const generatedEndTimeSlot = {
            begin: '2019-05-09T07:00:00.000Z',
            end: '2019-05-09T08:00:00.000Z',
            resource: 'some-resource',
          };

          const initialState = Immutable({
            selected: [
              originalStartTimeSlot,
              generatedEndTimeSlot,
            ]
          });

          const payload = {
            ...newEndTimeSlot,
            resource: {
              id: 'some-resource',
              minPeriod,
              slotSize: '01:00:00'
            }
          };

          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([originalStartTimeSlot, generatedEndTimeSlot]);

          expect(nextState.selected).toEqual(expected);
        });
      });
      describe('if slot is not already selected', () => {
        test('adds the given slot to selected, known as start time slot', () => {
          const initialState = Immutable({
            selected: [],
          });
          const slot = {
            begin: '2015-10-11T10:00:00Z',
            end: '2015-10-11T11:00:00Z',
            resource: 'some-resource',
          };

          const payload = { ...slot, resource: { id: 'some-resource' } };

          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([slot]);

          expect(nextState.selected).toEqual(expected);
        });

        test('does not affect other selected slots, add 2nd time slot, known as end time slot ', () => {
          const initialState = Immutable({
            selected: [
              {
                begin: '2015-12-12T10:00:00Z',
                end: '2015-12-12T11:00:00Z',
                resource: 'some-resource',
              },
            ],
          });
          const slot = {
            begin: '2015-10-11T10:00:00Z',
            end: '2015-10-11T11:00:00ZZ',
            resource: 'some-resource',
          };

          const payload = { ...slot, resource: { id: 'some-resource' } };

          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([...initialState.selected, slot]);

          expect(nextState.selected).toEqual(expected);
        });

        test(
          'replaces selected end slot with new end slot',
          () => {
            const initialState = Immutable({
              selected: [
                {
                  begin: '2015-12-12T10:00:00Z',
                  end: '2015-12-12T11:00:00Z',
                  resource: 'some-resource',
                },
                {
                  begin: '2015-12-12T11:00:00Z',
                  end: '2015-12-12T12:00:00Z',
                  resource: 'some-resource',
                },
              ],
            });
            const slot = {
              begin: '2015-12-12T13:00:00Z',
              end: '2015-12-12T14:00:00Z',
              resource: 'some-resource',
            };

            const payload = { ...slot, resource: { id: 'some-resource' } };


            const action = toggleTimeSlot(payload);
            const nextState = reservationsReducer(initialState, action);
            const expected = Immutable([initialState.selected[0], slot]);

            expect(nextState.selected).toEqual(expected);
          }
        );

        test('replaces selected end slot when slot in middle of selected', () => {
          const initialState = Immutable({
            selected: [
              {
                begin: '2015-12-12T10:00:00Z',
                end: '2015-12-12T11:00:00Z',
                resource: 'some-resource',
              },
              {
                begin: '2015-12-12T13:00:00Z',
                end: '2015-12-12T14:00:00Z',
                resource: 'some-resource',
              },
            ],
          });
          const slot = {
            begin: '2015-12-12T11:00:00Z',
            end: '2015-12-12T12:00:00Z',
            resource: 'some-resource',
          };

          const payload = { ...slot, resource: { id: 'some-resource' } };


          const action = toggleTimeSlot(payload);
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([initialState.selected[0], slot]);

          expect(nextState.selected).toEqual(expected);
        });
      });

      describe('if slot is already selected', () => {
        test('duplicated will not affect other selected slots ', () => {
          const slot1 = {
            begin: '2015-12-12T10:00:00Z',
            end: '2015-12-12T11:00:00Z',
            resource: 'some-resource',
          };
          const slot2 = {
            begin: '2015-10-11T10:00:00Z',
            end: '2015-10-11T11:00:00Z',
            resource: 'some-resource',
          };

          const payload = { ...slot2, resource: { id: 'some-resource' } };

          const action = toggleTimeSlot(payload);
          const initialState = Immutable({
            selected: [slot1, slot2],
          });
          const nextState = reservationsReducer(initialState, action);
          const expected = Immutable([slot1, slot2]);

          expect(nextState.selected).toEqual(expected);
        });
      });

      describe('UI.CLEAR_TIME_SLOTS', () => {
        test('clears one selected slot', () => {
          const action = clearTimeSlots();
          const initialState = Immutable({
            selected: [
              {
                begin: '2015-12-12T10:00:00Z',
                end: '2015-12-12T11:00:00Z',
                resource: 'some-resource',
              },
            ],
          });
          const nextState = reservationsReducer(initialState, action);
          expect(nextState.selected).toEqual([]);
        });

        test('clears many selected slots', () => {
          const action = clearTimeSlots();
          const initialState = Immutable({
            selected: [
              {
                begin: '2015-12-12T10:00:00Z',
                end: '2015-12-12T11:00:00Z',
                resource: 'some-resource',
              },
              {
                begin: '2015-12-12T13:00:00Z',
                end: '2015-12-12T14:00:00Z',
                resource: 'some-resource',
              },
            ],
          });
          const nextState = reservationsReducer(initialState, action);
          expect(nextState.selected).toEqual([]);
        });
      });
    });
  });
});
