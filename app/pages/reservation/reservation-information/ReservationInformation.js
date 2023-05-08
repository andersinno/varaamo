import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import camelCase from 'lodash/camelCase';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import moment from 'moment';

import injectT from '../../../i18n/injectT';
import constants from '../../../constants/AppConstants';
import { isStaffEvent, getReservationPricePerPeriod } from '../../../utils/reservationUtils';
import { getTermsAndConditions } from '../../../utils/resourceUtils';
import ReservationInformationForm from './ReservationInformationForm';

class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isPaymentRequired: PropTypes.bool.isRequired,
    isPayableAmount: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    reservation: PropTypes.object,
    reservationPriceInfo: PropTypes.object.isRequired,
    resource: PropTypes.object.isRequired,
    selectedTime: PropTypes.object.isRequired,
    setReservationPriceInfo: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    unit: PropTypes.object.isRequired,
  };

  onConfirm = (values) => {
    const { onConfirm } = this.props;
    onConfirm(values);
  }


  getFormFields = (termsAndConditions, specificTerms) => {
    const {
      isAdmin,
      isPaymentRequired,
      isPayableAmount,
      isStaff,
      resource,
    } = this.props;
    const formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (isAdmin) {
      formFields.push('comments');

      /* waiting for backend implementation */
      // formFields.push('reserverName');
      // formFields.push('reserverEmailAddress');
      // formFields.push('reserverPhoneNumber');
    }

    if (resource.needManualConfirmation && isStaff) {
      formFields.push('staffEvent');
    }

    if (termsAndConditions) {
      formFields.push('termsAndConditions');
    }

    if (specificTerms) {
      formFields.push('specificTerms');
    }

    // NOTE: these fields may still be included in the metadata,
    // as they may be required for non-payment related reasons.

    if (isPaymentRequired) {
      if (isPayableAmount) {
        formFields.push('paymentTermsAndConditions');
        formFields.push('billingFirstName');
        formFields.push('billingLastName');
        formFields.push('billingPhoneNumber');
        formFields.push('billingEmailAddress');
      }
      formFields.push('userGroup');
      formFields.push('eventType');
    }

    return uniq(formFields);
  }

  getFormInitialValues = () => {
    const {
      isEditing,
      reservation,
      resource,
    } = this.props;
    let rv = reservation ? pick(reservation, this.getFormFields()) : {};
    if (isEditing) {
      rv = { ...rv, staffEvent: isStaffEvent(reservation, resource) };
    }
    return rv;
  }

  getRequiredFormFields(resource, termsAndConditions, specificTerms) {
    const { isAdmin, isStaff } = this.props;

    if (isStaff) {
      return constants.REQUIRED_STAFF_EVENT_FIELDS;
    }

    const requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field),
    )];

    if (termsAndConditions) {
      if (!isAdmin) requiredFormFields.push('termsAndConditions');
    }

    if (specificTerms && !isAdmin) {
      requiredFormFields.push('specificTerms');
    }

    // NOTE: these fields are still assumed to be required even if
    // the resource is free to use, if the fields are in the metadata.
    // For example, we may wish to collect billing info from users for other
    // reasons than payment.

    requiredFormFields.push('paymentTermsAndConditions');
    requiredFormFields.push('userGroup');

    if (!isAdmin) {
      requiredFormFields.push('billingFirstName');
      requiredFormFields.push('billingLastName');
      requiredFormFields.push('billingEmailAddress');
    }

    return requiredFormFields;
  }

  getValue = (value, options) => options.find(option => option.value === value);

  render() {
    const {
      isEditing,
      isMakingReservations,
      isPayableAmount,
      isPaymentRequired,
      onBack,
      onCancel,
      resource,
      reservationPriceInfo,
      selectedTime,
      setReservationPriceInfo,
      t,
      unit,
      isStaff,
    } = this.props;

    const termsAndConditions = getTermsAndConditions(resource);
    const specificTerms = resource.specificTerms;
    const beginText = moment(selectedTime.begin).format('D.M.YYYY HH:mm');
    const endText = moment(selectedTime.end).format('HH:mm');
    const hours = moment(selectedTime.end).diff(selectedTime.begin, 'minutes') / 60;

    return (
      <div className="app-ReservationInformation">
        <Col md={7} sm={12}>
          <ReservationInformationForm
            fields={this.getFormFields(termsAndConditions, specificTerms)}
            initialValues={this.getFormInitialValues()}
            isEditing={isEditing}
            isMakingReservations={isMakingReservations}
            isPaymentRequired={isPaymentRequired}
            isStaff={isStaff}
            onBack={onBack}
            onCancel={onCancel}
            onConfirm={this.onConfirm}
            requiredFields={this.getRequiredFormFields(resource, termsAndConditions, specificTerms)}
            resource={resource}
            selectedTime={selectedTime}
            setReservationPriceInfo={setReservationPriceInfo}
            termsAndConditions={termsAndConditions}
          />
        </Col>
        <Col md={5} sm={12}>
          <div className={classNames('app-ReservationDetails')}>
            <h2 className="app-ReservationPage__title">{t('ReservationPage.detailsTitle')}</h2>
            <Row>
              <Col md={4}>
                <span className="app-ReservationDetails__name">
                  {t('common.resourceLabel')}
                </span>
              </Col>
              <Col md={8}>
                <span className="app-ReservationDetails__value">
                  {resource.name}
                  <br />
                  {unit.name}
                </span>
              </Col>
            </Row>
            {isPaymentRequired && (
              <Fragment>
                <Row>
                  <Col md={4}>
                    <span className="app-ReservationDetails__name">
                      {t('common.priceLabel')}
                    </span>
                  </Col>
                  <Col md={8}>
                    <span className="app-ReservationDetails__value">
                      {getReservationPricePerPeriod(reservationPriceInfo)}
                    </span>
                  </Col>
                </Row>
                {isPayableAmount && (
                  <Row>
                    <Col md={4}>
                      <span className="app-ReservationDetails__name">
                        {t('common.totalPriceLabel')}
                      </span>
                    </Col>
                    <Col md={8}>
                      <span className="app-ReservationDetails__value">
                        {t('common.priceWithVAT', {
                          price: reservationPriceInfo.total_price,
                          vat: reservationPriceInfo.tax_percentage,
                        })}
                      </span>
                    </Col>
                  </Row>
                )}
              </Fragment>
            )}
            <Row>
              <Col md={4}>
                <span className="app-ReservationDetails__name">
                  {t('ReservationPage.detailsTime')}
                </span>
              </Col>
              <Col md={8}>
                <span className="app-ReservationDetails__value">
                  {`${beginText}–${endText} (${hours} h)`}
                </span>
              </Col>
            </Row>
          </div>
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
