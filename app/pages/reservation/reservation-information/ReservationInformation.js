import pick from 'lodash/pick';
import uniq from 'lodash/uniq';
import isEmpty from 'lodash/isEmpty';
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

const BILLING_FIELDS = [
  'billingFirstName',
  'billingLastName',
  'billingPhoneNumber',
  'billingEmailAddress',
  'paymentTermsAndConditions',
];

const COMPANY_FIELDS = [
  'reserverId',
  'company',
  'companyEmailAddress',
  'companyPhoneNumber',
  'companyAddressZip',
  'companyAddressCity',
  'companyAddressStreet',
];


class ReservationInformation extends Component {
  static propTypes = {
    isAdmin: PropTypes.bool.isRequired,
    isEditing: PropTypes.bool.isRequired,
    isMakingReservations: PropTypes.bool.isRequired,
    isOwnUse: PropTypes.bool.isRequired,
    isPaymentRequired: PropTypes.bool.isRequired,
    isPayableAmount: PropTypes.bool.isRequired,
    isInvoiceRequested: PropTypes.bool.isRequired,
    isStaff: PropTypes.bool.isRequired,
    onBack: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onChangeReservationType: PropTypes.func.isRequired,
    onChangeInvoiceRequested: PropTypes.func.isRequired,
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

  getPaymentFormFields = () => {
    // provide list of fields to be rendered depending on payment options
    const {
      resource,
      isInvoiceRequested,
      isPayableAmount,
      isPaymentRequired,
      isStaff,
    } = this.props;

    if (!isPaymentRequired) {
      return [];
    }

    const { pricingEventTypes, canRequestInvoice } = resource;

    let paymentFields = ['userGroup'];

    if (!isEmpty(pricingEventTypes)) {
      paymentFields = [...paymentFields, 'eventType'];
    }

    if (!isPayableAmount) {
      return paymentFields;
    }

    if (isStaff || !canRequestInvoice) {
      return [...paymentFields, ...BILLING_FIELDS];
    }

    return [
      ...paymentFields,
      'invoiceRequested',
      ...isInvoiceRequested ? COMPANY_FIELDS : BILLING_FIELDS
    ];
  }

  getFormFields = (termsAndConditions, specificTerms) => {
    const {
      isAdmin,
      isStaff,
      resource,
    } = this.props;
    let formFields = [...resource.supportedReservationExtraFields].map(value => camelCase(value));

    if (isAdmin) {
      formFields.push('comments');
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

    formFields = [...formFields, ...this.getPaymentFormFields()]

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
    const {
      isAdmin,
      isOwnUse,
      isInvoiceRequested,
      isStaff,
    } = this.props;

    const paymentFields = [
      'paymentTermsAndConditions',
      'userGroup',
      'eventType',
    ];

    const billingFields = [
      'billingFirstName',
      'billingLastName',
      'billingEmailAddress',
    ];

    const invoiceFields = [
      'reserverId',
      'companyAddressZip',
      'companyAddressCity',
      'companyAddressStreet',
    ];

    let requiredFormFields = [];

    // staff members: only require staff form fields + payment/billing fields if "normal"
    // reservation type
    if (isStaff) {
      requiredFormFields = constants.REQUIRED_STAFF_EVENT_FIELDS;
      if (isOwnUse) {
        requiredFormFields = [...requiredFormFields, ...paymentFields, ...billingFields];
      }
      return requiredFormFields;
    }

    requiredFormFields = [...resource.requiredReservationExtraFields.map(
      field => camelCase(field),
    )];

    if (!isAdmin) {
      if (termsAndConditions) {
        requiredFormFields = [...requiredFormFields, 'termsAndConditions'];
      }
      if (specificTerms) {
        requiredFormFields = [...requiredFormFields, 'specificTerms'];
      }
      if (isInvoiceRequested) {
        requiredFormFields = [...requiredFormFields, ...invoiceFields];
      }
    }
    // NOTE: these fields are still assumed to be required even if
    // the resource is free to use, if the fields are in the metadata.
    // For example, we may wish to collect billing info from users for other
    // reasons than payment.

    requiredFormFields = [...requiredFormFields, ...paymentFields];

    if (!isAdmin || isOwnUse) {
      requiredFormFields = [...requiredFormFields, ...billingFields];
    }

    return requiredFormFields;
  }

  getValue = (value, options) => options.find(option => option.value === value);

  isManualConfirmationRequiredForPayment = () => {
    // some resources require manual confirmation if the selected price list options
    // result in a zero price
    const {
      isPaymentRequired,
      reservationPriceInfo,
      resource,
      isStaff,
    } = this.props;

    return resource.needManualConfirmationForZeroPrice
      && parseFloat(reservationPriceInfo.total_price) === 0
      && isPaymentRequired
      && !isStaff;
  }

  render() {
    const {
      isEditing,
      isInvoiceRequested,
      isMakingReservations,
      isPayableAmount,
      isPaymentRequired,
      onBack,
      onCancel,
      onChangeReservationType,
      onChangeInvoiceRequested,
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
            isPayableAmount={isPayableAmount}
            isPaymentRequired={isPaymentRequired}
            isInvoiceRequested={isInvoiceRequested}
            isStaff={isStaff}
            onBack={onBack}
            onCancel={onCancel}
            onChangeReservationType={onChangeReservationType}
            onChangeInvoiceRequested={onChangeInvoiceRequested}
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
            {this.isManualConfirmationRequiredForPayment() && (
              <Row>
                <Col md={12}>
                  <strong className="app-ReservationDetails__needManualConfirmation">
                    {t('ReservationInfo.requiresManualConfirmation')}
                  </strong>
                </Col>
              </Row>
            )}
          </div>
        </Col>
      </div>
    );
  }
}

export default injectT(ReservationInformation);
