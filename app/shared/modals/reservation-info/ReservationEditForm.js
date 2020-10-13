import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Well from 'react-bootstrap/lib/Well';
import { Field, Fields, reduxForm } from 'redux-form';
import moment from 'moment';

import { resourceRoles, resourcePermissionTypes } from '../../../../src/domain/resource/permissions/constants';
import { hasPermissionForResource } from '../../../../src/domain/resource/permissions/utils';
import { getReservationPrice, getTaxPercentage } from '../../../../src/domain/resource/utils';
import FormTypes from '../../../constants/FormTypes';
import { hasProducts } from '../../../utils/resourceUtils';
import ReduxFormField from '../../form-fields/ReduxFormField';
import ReservationTimeControls from '../../form-fields/ReservationTimeControls';
import TimeRange from '../../time-range/TimeRange';
import injectT from '../../../i18n/injectT';
import constants from '../../../constants/AppConstants';
import { getShowRefundPolicy } from '../../../../src/domain/reservation/utils';

// We have a generic utility function with the same purpose, but it has
// been developed to be snake_case compatible. In this view we are still
// using resource objects from the redux state, and those use camelCase.
const getReservationOpeningHoursByDate = (resource, reservationDate) => {
  const openHours = resource.openingHours || [];

  return openHours.find(openHour => openHour.date === reservationDate);
};

class UnconnectedReservationEditForm extends Component {
  constructor(props) {
    super(props);
    this.renderAddressRow = this.renderAddressRow.bind(this);
    this.renderEditableInfoRow = this.renderEditableInfoRow.bind(this);
    this.renderInfoRow = this.renderInfoRow.bind(this);
    this.renderReservationTime = this.renderReservationTime.bind(this);
  }

  getAddress(street, zip, city) {
    const ending = `${zip} ${city}`;
    if (street && (zip || city)) {
      return `${street}, ${ending}`;
    }
    return `${street} ${ending}`;
  }

  renderAddressRow(addressType) {
    const { reservation, t } = this.props;
    const hasAddress = (
      reservation.reserverAddressStreet || reservation.reserverAddressStreet === ''
    );
    if (!hasAddress) return null;
    const label = t(`common.${addressType}Label`);
    const value = this.getAddress(
      reservation[`${addressType}Street`],
      reservation[`${addressType}Zip`],
      reservation[`${addressType}City`],
    );
    return this.renderInfoRow(label, value);
  }

  renderInfoRow(label, value, rest) {
    if (!value && value !== '') return null;
    return (
      <FormGroup {...rest}>
        <Col sm={3}>
          <ControlLabel>{label}</ControlLabel>
        </Col>
        <Col sm={9}>
          <FormControl.Static>{value}</FormControl.Static>
        </Col>
      </FormGroup>
    );
  }

  renderEditableInfoRow(propertyName, type) {
    const { isEditing, reservation, t } = this.props;
    if (!isEditing) return this.renderStaticInfoRow(propertyName);
    const property = reservation[propertyName];
    if (!property && property !== '') return null;
    return (
      <Field
        component={ReduxFormField}
        controlProps={{}}
        label={t(`common.${propertyName}Label`)}
        name={propertyName}
        type={type}
      />
    );
  }

  renderStaticInfoRow(propertyName) {
    const { reservation, t } = this.props;
    const value = reservation[propertyName];
    const label = t(`common.${propertyName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderUserInfoRow(userPropertyName, labelName) {
    const { reservation, t } = this.props;
    const user = reservation.user || {};
    const value = user[userPropertyName];
    const label = t(`common.${labelName}Label`);
    return this.renderInfoRow(label, value);
  }

  renderReservationTime() {
    const {
      isEditing, reservation, resource, t, userUnitRole,
    } = this.props;

    if (isEditing) {
      const canIgnoreOpeningHours = hasPermissionForResource(
        userUnitRole,
        resourcePermissionTypes.CAN_IGNORE_OPENING_HOURS,
      );
      const reservationDate = moment(reservation.begin).format(constants.DATE_FORMAT);
      const openingHoursForReservationDate = getReservationOpeningHoursByDate(resource, reservationDate);
      const getConstraints = (openingHours) => {
        if (!openingHours || canIgnoreOpeningHours) {
          return undefined;
        }

        return {
          startTime: moment(openingHours.opens).format('HH:mm'),
          endTime: moment(openingHours.closes).format('HH:mm'),
        };
      };

      return (
        <FormGroup id="reservation-time">
          <Col sm={3}>
            <ControlLabel>{t('common.reservationTimeLabel')}</ControlLabel>
          </Col>
          <Col sm={9}>
            <Fields
              component={ReservationTimeControls}
              constraints={getConstraints(openingHoursForReservationDate)}
              disabled={!canIgnoreOpeningHours && !openingHoursForReservationDate}
              names={['begin', 'end']}
              period={resource.slotSize}
            />
          </Col>
        </FormGroup>
      );
    }
    const staticReservationTime = <TimeRange begin={reservation.begin} end={reservation.end} />;
    return this.renderInfoRow(t('common.reservationTimeLabel'), staticReservationTime);
  }

  render() {
    const {
      handleSubmit,
      isAdmin,
      isEditing,
      isSaving,
      userUnitRole,
      onCancelEditClick,
      onStartEditClick,
      reservation,
      reservationIsEditable,
      resource,
      t,
    } = this.props;

    if (isEmpty(reservation)) return <span />;

    const price = getReservationPrice(reservation.begin, reservation.end, resource);
    const tax = getTaxPercentage(resource);
    const tVariables = {
      price,
      tax,
    };
    const canViewExtraFields = hasPermissionForResource(
      userUnitRole,
      resourcePermissionTypes.CAN_VIEW_RESERVATION_EXTRA_FIELDS,
    );

    const {
      billingFirstName, billingLastName, billingEmailAddress, isOwn, user,
    } = reservation;

    const isAdminOrOwner = (isAdmin || isOwn);
    const showRefundPolicy = getShowRefundPolicy(isAdmin, reservation, resource);

    return (
      <Form
        className={classNames('reservation-edit-form', { editing: isEditing })}
        horizontal
        onSubmit={handleSubmit}
      >
        {user && (
          <Well>
            {this.renderUserInfoRow('displayName', 'userName')}
            {this.renderUserInfoRow('email', 'userEmail')}
          </Well>
        )}
        { billingFirstName
        && billingLastName
        && this.renderInfoRow(t('common.paymentNameLabel'), `${billingFirstName} ${billingLastName}`)}
        {billingEmailAddress && this.renderInfoRow(t('common.paymentEmailLabel'), billingEmailAddress)}

        {this.renderEditableInfoRow('eventSubject', 'text')}
        {this.renderStaticInfoRow('reserverName')}
        {this.renderEditableInfoRow('eventDescription', 'textarea')}
        {this.renderEditableInfoRow('numberOfParticipants', 'number')}
        {this.renderReservationTime()}
        {this.renderInfoRow(t('common.resourceLabel'), resource.name)}
        {!reservation.staffEvent
          && price > 0
          && this.renderInfoRow(t('common.priceLabel'), t('ReservationEditForm.priceWithTax', tVariables))}

        {showRefundPolicy
          && this.renderInfoRow(
            t('ReservationInformationForm.refundPolicyTitle'),
            <>
              {t('ReservationInformationForm.refundPolicyText.1')}
              <a href={`mailto:${t('ReservationInformationForm.refundPolicyText.2')}`}>
                {t('ReservationInformationForm.refundPolicyText.2')}
              </a>
              {t('ReservationInformationForm.refundPolicyText.3')}
            </>,
            { id: 'refund-policy' },
          )
        }
        {canViewExtraFields && this.renderStaticInfoRow('reserverId')}
        {this.renderStaticInfoRow('reserverPhoneNumber')}
        {this.renderStaticInfoRow('reserverEmailAddress')}
        {this.renderAddressRow('reserverAddress')}
        {this.renderAddressRow('billingAddress')}
        {this.renderStaticInfoRow('accessCode')}
        {this.renderStaticInfoRow('reservationExtraQuestions')}
        {isAdmin && !reservationIsEditable && this.renderStaticInfoRow('comments')}
        {isAdminOrOwner && reservationIsEditable && (
          <div className="form-controls">
            {isAdminOrOwner && !isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving || (!isAdmin && hasProducts(resource))}
                onClick={onStartEditClick}
              >
                {t('ReservationEditForm.startEdit')}
              </Button>
            )}
            {isAdmin && isEditing && (
              <Button
                bsStyle="default"
                disabled={isSaving}
                onClick={onCancelEditClick}
              >
                {t('ReservationEditForm.cancelEdit')}
              </Button>
            )}
            {isAdmin && isEditing && (
              <Button
                bsStyle="primary"
                disabled={isSaving}
                type="submit"
              >
                {t('ReservationEditForm.saveChanges')}
              </Button>
            )}
          </div>
        )}
      </Form>
    );
  }
}

UnconnectedReservationEditForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isSaving: PropTypes.bool.isRequired,
  userUnitRole: PropTypes.oneOf([...Object.values(resourceRoles), null]),
  onCancelEditClick: PropTypes.func.isRequired,
  onStartEditClick: PropTypes.func.isRequired,
  reservation: PropTypes.object.isRequired,
  reservationIsEditable: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
};
UnconnectedReservationEditForm = injectT(UnconnectedReservationEditForm);  // eslint-disable-line

export { UnconnectedReservationEditForm };
export default injectT(reduxForm({
  form: FormTypes.RESERVATION_EDIT,
})(UnconnectedReservationEditForm));
