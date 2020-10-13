import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';
import { FormattedHTMLMessage } from 'react-intl';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toggle from 'react-toggle';

import { getHasOnlinePaymentSupport } from '../../../../src/domain/resource/utils';
import { deleteReservation } from '../../../actions/reservationActions';
import { closeReservationCancelModal } from '../../../actions/uiActions';
import CompactReservationList from '../../compact-reservation-list/CompactReservationList';
import injectT from '../../../i18n/injectT';
import reservationCancelModalSelector from './reservationCancelModalSelector';
import { hasProducts } from '../../../utils/resourceUtils';

class UnconnectedReservationCancelModalContainer extends Component {
  constructor(props) {
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = { checkboxDisabled: null };
  }

  handleCancel() {
    const { actions, reservation } = this.props;
    actions.deleteReservation(reservation);
    actions.closeReservationCancelModal();
  }

  handleCheckbox() {
    this.setState(prevState => ({ checkboxDisabled: !prevState.checkboxDisabled }));
  }

  renderCheckBox(notice, onConfirm) {
    return (
      <div>
        <p><strong>{notice}</strong></p>
        <Toggle
          defaultChecked={false}
          id="checkbox"
          onChange={e => onConfirm(e.target.checked)}
        />
      </div>
    );
  }

  render() {
    const {
      actions,
      cancelAllowed,
      isCancellingReservations,
      reservation,
      resource,
      show,
      t,
    } = this.props;

    const resourceHasOnlinePaymentSupport = getHasOnlinePaymentSupport(resource);

    return (
      <Modal
        onHide={() => {
          actions.closeReservationCancelModal();
          if (hasProducts(resource)) this.setState({ checkboxDisabled: true });
        }}
        show={show}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {cancelAllowed
              ? t('ReservationCancelModal.cancelAllowedTitle')
              : t('ReservationCancelModal.cancelNotAllowedTitle')
            }
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {cancelAllowed
            && (
            <div>
              <p><strong>{t('ReservationCancelModal.lead')}</strong></p>
              {reservation.resource
                && (
                <CompactReservationList
                  reservations={[reservation]}
                  resources={{ [resource.id]: resource }}
                />
                )
              }
              {reservation.resource && !reservation.staffEvent && hasProducts(resource) && this.renderCheckBox(
                t('ReservationInformationForm.refundCheckBox'),
                this.handleCheckbox,
              )}
            </div>
            )
          }
          {!cancelAllowed
            && (
            <div>
              {resourceHasOnlinePaymentSupport && (
                <>
                  <p>{t('ReservationCancelModal.cancelNotAllowedInfoOnlinePayment.1')}</p>
                  <p>{t('ReservationCancelModal.cancelNotAllowedInfoOnlinePayment.2')}</p>
                </>
              )}
              {!resourceHasOnlinePaymentSupport && (
                <>
                  <p>{t('ReservationCancelModal.cancelNotAllowedInfo')}</p>
                  <p><FormattedHTMLMessage id="ReservationCancelModal.takeIntoAccount" /></p>
                </>
              )}
              <p className="responsible-contact-info">{resource.responsibleContactInfo}</p>
            </div>
            )
          }
        </Modal.Body>

        <Modal.Footer>
          <Button
            bsStyle="default"
            onClick={() => {
              actions.closeReservationCancelModal();
              if (hasProducts(resource)) this.setState({ checkboxDisabled: true });
            }}
          >
            {cancelAllowed
              ? t('ReservationCancelModal.cancelAllowedCancel')
              : t('common.back')
            }
          </Button>
          {cancelAllowed && (
            <Button
              bsStyle="danger"
              disabled={
                hasProducts(resource)
                  ? this.state.checkboxDisabled
                  : isCancellingReservations
              }
              onClick={this.handleCancel}
            >
              {isCancellingReservations
                ? t('common.cancelling')
                : t('ReservationCancelModal.cancelAllowedConfirm')
              }
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
}

UnconnectedReservationCancelModalContainer.propTypes = {
  actions: PropTypes.object.isRequired,
  cancelAllowed: PropTypes.bool.isRequired,
  isCancellingReservations: PropTypes.bool.isRequired,
  reservation: PropTypes.object.isRequired,
  resource: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

UnconnectedReservationCancelModalContainer = injectT(UnconnectedReservationCancelModalContainer);  // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    closeReservationCancelModal,
    deleteReservation,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedReservationCancelModalContainer };
export default connect(reservationCancelModalSelector, mapDispatchToProps)(
  UnconnectedReservationCancelModalContainer,
);
