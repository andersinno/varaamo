import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Modal from 'react-bootstrap/lib/Modal';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import ReservationStateLabel from 'shared/reservation-state-label';
import Reservation from 'utils/fixtures/Reservation';
import Resource from 'utils/fixtures/Resource';
import { shallowWithIntl } from 'utils/testUtils';
import ReservationEditForm from './ReservationEditForm';
import ReservationInfoModal from './ReservationInfoModal';

describe('shared/modals/reservation-info/ReservationInfoModal', () => {
  const resource = Resource.build();
  const reservation = Reservation.build({
    billingAddressCity: 'New York',
    billingAddressStreet: 'Billing Street 11',
    billingAddressZip: '99999',
    reserverId: '112233-123A',
    comments: 'Just some comments.',
    eventDescription: 'Jedi mind tricks',
    numberOfParticipants: 12,
    reserverAddressCity: 'Mos Eisley',
    reserverAddressStreet: 'Cantina street 3B',
    reserverAddressZip: '11111',
    reserverEmailAddress: 'luke@sky.com',
    reserverName: 'Luke Skywalker',
    reserverPhoneNumber: '1234567',
    resource: resource.id,
  });
  const defaultProps = {
    hideReservationInfoModal: () => null,
    isAdmin: false,
    isEditing: false,
    isSaving: false,
    isStaff: false,
    onCancelClick: () => null,
    onCancelEditClick: () => null,
    onConfirmClick: () => null,
    onDenyClick: () => null,
    onEditFormSubmit: () => null,
    onSaveCommentsClick: () => null,
    onStartEditClick: () => null,
    reservation: Immutable(reservation),
    reservationIsEditable: false,
    resource: Immutable(resource),
    show: true,
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<ReservationInfoModal {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders a Modal component', () => {
      const modalComponent = getWrapper().find(Modal);

      expect(modalComponent.length).toBe(1);
    });

    describe('Modal header', () => {
      const modalHeader = getWrapper().find(Modal.Header);

      test('renders a ModalHeader component', () => {
        expect(modalHeader.length).toBe(1);
      });

      test('contains a close button', () => {
        expect(modalHeader.props().closeButton).toBe(true);
      });

      test('renders a ModalTitle with correct title', () => {
        const modalTitle = getWrapper().find(Modal.Title);
        expect(modalTitle.length).toBe(1);
        expect(modalTitle.prop('children')).toBe('ReservationInfoModal.title');
      });
    });

    describe('Modal body', () => {
      const modalBody = getWrapper().find(Modal.Body);

      test('renders a ModalBody component', () => {
        expect(modalBody.length).toBe(1);
      });

      test('renders ReservationStateLabel component', () => {
        const reservationStateLabel = getWrapper().find(ReservationStateLabel);
        expect(reservationStateLabel.length).toBe(1);
      });

      test('renders ReservationEditForm component', () => {
        expect(getWrapper().find(ReservationEditForm)).toHaveLength(1);
      });

      describe('comments form', () => {
        function getCommentsForm(props) {
          return getWrapper(props).find('.comments-form');
        }

        describe('if user has admin rights but reservation is not editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: false,
          };

          test('is not rendered', () => {
            expect(getCommentsForm(props)).toHaveLength(0);
          });
        });

        describe('if user has admin rights and reservation is editable', () => {
          const props = {
            isAdmin: true,
            reservationIsEditable: true,
          };

          test('is rendered', () => {
            expect(getCommentsForm(props)).toHaveLength(1);
          });

          test('renders textarea FormControl for comments with correct props', () => {
            const wrapper = getWrapper(props);
            const formControl = wrapper.find('.comments-form').find(FormControl);
            const mockRef = { value: 'foo' };

            formControl.prop('inputRef')(mockRef);
            // change input value

            expect(formControl).toHaveLength(1);
            expect(formControl.prop('componentClass')).toBe('textarea');
            expect(formControl.prop('defaultValue')).toBe(reservation.comments);
            expect(typeof formControl.prop('inputRef')).toBe('function');
            expect(wrapper.instance().commentsInput).toEqual(mockRef);
          });

          test('renders a save button with correct onClick prop', () => {
            const wrapper = getWrapper(props);
            const button = wrapper.find('.comments-form').find(Button);
            const instance = wrapper.instance();
            expect(button.props().children).toBe('ReservationInfoModal.saveComment');
            expect(button.props().onClick).toBe(instance.handleSaveCommentsClick);
          });
        });

        describe('if user does not have admin rights', () => {
          const props = {
            isAdmin: false,
          };

          test('is not rendered', () => {
            expect(getCommentsForm(props)).toHaveLength(0);
          });
        });
      });
    });

    describe('Footer', () => {
      describe('back button', () => {
        function getBackButton(props) {
          const hideReservationInfoModal = () => null;
          const wrapper = getWrapper({ ...props, hideReservationInfoModal });
          const buttons = wrapper.find(Modal.Footer).find(Button);
          return buttons.filter({ onClick: hideReservationInfoModal });
        }

        test('is rendered if user is a regular user', () => {
          const button = getBackButton({ isAdmin: false });
          expect(button).toHaveLength(1);
        });

        test('is rendered if user is an admin', () => {
          const button = getBackButton({ isAdmin: true });
          expect(button).toHaveLength(1);
        });
      });

      describe('deny button', () => {
        function getDenyButton(props) {
          const onDenyClick = () => null;
          const wrapper = getWrapper({ ...props, onDenyClick });
          const buttons = wrapper.find(Modal.Footer).find(Button);
          return buttons.filter({ onClick: onDenyClick });
        }

        test('is not rendered if user is not a staff member', () => {
          const props = {
            isStaff: false,
            reservationIsEditable: true,
            reservation: { ...reservation, state: 'requested' },
          };
          expect(getDenyButton(props)).toHaveLength(0);
        });

        test('is not rendered if reservation is not editable', () => {
          const props = {
            isStaff: true,
            reservationIsEditable: false,
            reservation: { ...reservation, state: 'requested' },
          };
          expect(getDenyButton(props)).toHaveLength(0);
        });

        test('is not rendered if reservation state is not "requested"', () => {
          const props = {
            isStaff: true,
            reservationIsEditable: true,
            reservation: { ...reservation, state: 'confirmed' },
          };
          expect(getDenyButton(props)).toHaveLength(0);
        });

        test(
          'is rendered if user is staff, reservation is editable and in "requested" state',
          () => {
            const props = {
              isStaff: true,
              reservationIsEditable: true,
              reservation: { ...reservation, state: 'requested' },
            };
            expect(getDenyButton(props)).toHaveLength(1);
          }
        );
      });

      describe('confirm button', () => {
        function getConfirmButton(props) {
          const onConfirmClick = () => null;
          const wrapper = getWrapper({ ...props, onConfirmClick });
          const buttons = wrapper.find(Modal.Footer).find(Button);
          return buttons.filter({ onClick: onConfirmClick });
        }

        test('is not rendered if user is not a staff member', () => {
          const props = {
            isStaff: false,
            reservationIsEditable: true,
            reservation: { ...reservation, state: 'requested' },
          };
          expect(getConfirmButton(props)).toHaveLength(0);
        });

        test('is not rendered if reservation is not editable', () => {
          const props = {
            isStaff: true,
            reservationIsEditable: false,
            reservation: { ...reservation, state: 'requested' },
          };
          expect(getConfirmButton(props)).toHaveLength(0);
        });

        test('is not rendered if reservation state is not "requested"', () => {
          const props = {
            isStaff: true,
            reservationIsEditable: true,
            reservation: { ...reservation, state: 'confirmed' },
          };
          expect(getConfirmButton(props)).toHaveLength(0);
        });

        test(
          'is rendered if user is staff, reservation is editable and in "requested" state',
          () => {
            const props = {
              isStaff: true,
              reservationIsEditable: true,
              reservation: { ...reservation, state: 'requested' },
            };
            expect(getConfirmButton(props)).toHaveLength(1);
          }
        );
      });

      describe('cancel button', () => {
        function getCancelButton(props) {
          const onCancelClick = () => null;
          const wrapper = getWrapper({ ...props, onCancelClick });
          const buttons = wrapper.find(Modal.Footer).find(Button);
          return buttons.filter({ onClick: onCancelClick });
        }

        describe('if reservation is not editable', () => {
          const reservationIsEditable = false;

          test('is not rendered', () => {
            const props = {
              reservationIsEditable,
              reservation: { ...reservation, state: 'confirmed' },
            };
            expect(getCancelButton(props)).toHaveLength(0);
          });
        });

        describe('if reservation is editable', () => {
          const reservationIsEditable = true;

          test('is rendered if reservation state is "confirmed"', () => {
            const props = {
              reservationIsEditable,
              reservation: { ...reservation, state: 'confirmed' },
            };
            expect(getCancelButton(props)).toHaveLength(1);
          });

          test(
            'is rendered for regular users if reservation state is "requested"',
            () => {
              const props = {
                isAdmin: false,
                reservationIsEditable,
                reservation: { ...reservation, state: 'requested' },
              };
              expect(getCancelButton(props)).toHaveLength(1);
            }
          );

          test('is not rendered for admins if reservation state is "requested"', () => {
            const props = {
              isAdmin: true,
              reservationIsEditable,
              reservation: { ...reservation, state: 'requested' },
            };
            expect(getCancelButton(props)).toHaveLength(0);
          });

          test('is not rendered if reservation state is "cancelled"', () => {
            const props = {
              reservationIsEditable,
              reservation: { ...reservation, state: 'cancelled' },
            };
            expect(getCancelButton(props)).toHaveLength(0);
          });

          test('is not rendered if reservation state is "denied"', () => {
            const props = {
              reservationIsEditable,
              reservation: { ...reservation, state: 'denied' },
            };
            expect(getCancelButton(props)).toHaveLength(0);
          });
        });
      });
    });
  });

  describe('handleEditFormSubmit', () => {
    const onEditFormSubmit = simple.mock();

    function callHandleEditFormSubmit(values) {
      const instance = getWrapper({ onEditFormSubmit }).instance();
      instance.handleEditFormSubmit(values);
    }

    test('calls onEditFormSubmit with updated reservation values', () => {
      const values = {
        eventDescription: 'Updated description',
        reserverName: 'Han Solo',
      };
      callHandleEditFormSubmit(values);
      const expected = { ...reservation, ...values, staffEvent: false };
      expect(onEditFormSubmit.callCount).toBe(1);
      expect(onEditFormSubmit.lastCall.args).toEqual([expected]);
    });
  });

  describe('handleSaveCommentsClick', () => {
    const onSaveCommentsClick = simple.mock();
    const comments = 'Updated comments';

    beforeAll(() => {
      const instance = getWrapper({ onSaveCommentsClick }).instance();
      // override ref value to mock
      instance.commentsInput = { value: comments };
      instance.handleSaveCommentsClick();
    });

    afterAll(() => {
      simple.restore();
    });

    test('calls onSaveCommentsClick with correct comments', () => {
      expect(onSaveCommentsClick.callCount).toBe(1);
      expect(onSaveCommentsClick.lastCall.args).toEqual([comments]);
    });
  });
});
