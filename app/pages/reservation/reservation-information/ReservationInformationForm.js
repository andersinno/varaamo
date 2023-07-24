import { isEmpty } from 'lodash/lang'
import includes from 'lodash/includes';
import intersection from 'lodash/intersection';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from 'react-bootstrap/lib/Button';
import Form from 'react-bootstrap/lib/Form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Field, SubmissionError, reduxForm } from 'redux-form';
import isEmail from 'validator/lib/isEmail';
import { connect } from 'react-redux';

import TermsField from '../../../shared/form-fields/TermsField';
import FormTypes from '../../../constants/FormTypes';
import ReservationMetadataField from './ReservationMetadataField';
import DropdownField from './DropdownField';
import injectT from '../../../i18n/injectT';
import { hasProducts } from '../../../utils/resourceUtils';
import WrappedText from '../../../shared/wrapped-text/WrappedText';
import InternalReservationFields from './InternalReservationFields';
import { toCamelCase } from '../../../../src/common/data/utils';
import { INPUT_PURPOSES } from '../../../../src/constants/InputPurposes';
import ReservationInformationNotification from './ReservationInformationNotification';
import apiClient from '../../../../src/common/api/client';
import { getResourceReservationPrice } from '../../../utils/reservationUtils';

const validators = {
  reserverEmailAddress: (t, { reserverEmailAddress }) => {
    if (reserverEmailAddress && !isEmail(reserverEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
  billingEmailAddress: (t, { billingEmailAddress }) => {
    if (billingEmailAddress && !isEmail(billingEmailAddress)) {
      return t('ReservationForm.emailError');
    }
    return null;
  },
  numberOfParticipants: (t, { numberOfParticipants }) => {
    const isNumber = !isNaN(numberOfParticipants);

    if (numberOfParticipants && !isNumber) {
      return t('ReservationForm.numberOfParticipantsError');
    }

    return null;
  },
};

const maxLengths = {
  billingAddressCity: 100,
  billingAddressStreet: 100,
  billingAddressZip: 30,
  billingEmailAddress: 100,
  billingFirstName: 100,
  billingLastName: 100,
  billingPhoneNumber: 30,
  company: 100,
  companyAddressCity: 100,
  companyAddressStreet: 100,
  companyAddressZip: 30,
  companyEmailAddress: 100,
  companyPhoneNumber: 30,
  numberOfParticipants: 100,
  reserverAddressCity: 100,
  reserverAddressStreet: 100,
  reserverAddressZip: 30,
  reserverEmailAddress: 100,
  reserverId: 30,
  reserverName: 100,
  reserverPhoneNumber: 30,
  comments: 1500,
};

function isTermsAndConditionsField(field) {
  const termsAndConditionsFields = ['termsAndConditions', 'paymentTermsAndConditions', 'specificTerms'];

  return termsAndConditionsFields.includes(field);
}

function getTermsAndConditionsError(field) {
  const errorLabels = {
    paymentTermsAndConditions: 'ReservationForm.paymentTermsAndConditionsError',
    termsAndConditions: 'ReservationForm.termsAndConditionsError',
    specificTerms: 'ReservationForm.specificTermsError',
  };
  const errorLabel = errorLabels[field];

  if (!errorLabel) {
    return errorLabels.termsAndConditions;
  }

  return errorLabel;
}

export function validate(values, { fields, requiredFields, t }) {
  const errors = {};
  fields.forEach((field) => {
    const validator = validators[field];
    if (validator) {
      const error = validator(t, values);
      if (error) {
        errors[field] = error;
      }
    }
    if (maxLengths[field]) {
      if (values[field] && values[field].length > maxLengths[field]) {
        errors[field] = t('ReservationForm.maxLengthError', { maxLength: maxLengths[field] });
      }
    }
    if (includes(requiredFields, field)) {
      if (!values[field]) {
        errors[field] = (
          isTermsAndConditionsField(field)
            ? t(getTermsAndConditionsError(field))
            : t('ReservationForm.requiredError')
        );
      }
    }
  });
  return errors;
}

class UnconnectedReservationInformationForm extends Component {
  state = {
    selectedUserGroup: null,
    selectedEventType: null,
  }

  getAsteriskExplanation = () => {
    const { resource, t } = this.props;
    const maybeBillable = resource.minPricePerHour && resource.maxPricePerHour;
    if (resource.needManualConfirmation && maybeBillable) {
      return `${t('ConfirmReservationModal.priceInfo')} ${t('ReservationForm.reservationFieldsAsteriskManualBilling')}`;
    }
    if (resource.needManualConfirmation && !hasProducts(resource)) {
      return t('ReservationForm.reservationFieldsAsteriskManualBilling');
    }
    if (!resource.needManualConfirmation && hasProducts(resource)) {
      return t('ReservationForm.reservationFieldsAsteriskNormal');
    }
    return t('ReservationForm.reservationFieldsAsteriskNormal');
  };

  getUserGroupOptions = () => {
    const { resource } = this.props;
    const reservationUserGroups = resource.pricingUserGroups ? [...resource.pricingUserGroups] : [];
    const reservationUserGroupOptions = [...reservationUserGroups].map(userGroup => (
      { value: userGroup.id, label: userGroup.name }
    ));
    return reservationUserGroupOptions;
  }

  getEventTypeOptions = () => {
    const { resource, t } = this.props;
    const reservationEventTypes = resource.pricingEventTypes ? [...resource.pricingEventTypes] : [];
    if (isEmpty(reservationEventTypes)) {
      return [];
    }
    const eventTypeOptions = [...reservationEventTypes].map(eventType => (
      { value: eventType.id, label: eventType.name }
    ));

    // Add "None of the above" as the last option. This option does not affect the price
    // but the user is still required to select it if none of the other options apply.
    if (resource.includeOtherEventTypeOption) {
      eventTypeOptions.push({
        value: null,
        label: t('ReservationInformationForm.noneOfTheAboveOptionLabel'),
      });
    }

    return eventTypeOptions;
  }

  handleInvoiceOption = (event) => {
    this.props.onChangeInvoiceRequested(event.target.value === 'on');
  }

  handleUserGroupChange = async (e) => {
    // TODO: Simplify this using selector. Selector had issue of not
    // updating the values the first time.
    let userGroup = null;
    let eventType = null;
    if (e.target.name === 'userGroup') {
      this.setState({ selectedUserGroup: e.target.value });
      userGroup = e.target.value;
      eventType = this.state.selectedEventType;
    } else if (e.target.name === 'eventType') {
      this.setState({ selectedEventType: e.target.value });
      userGroup = this.state.selectedUserGroup;
      eventType = e.target.value;
    }
    const { begin, end } = this.props.selectedTime;
    const resourceId = this.props.resource.id;
    const productId = this.props.resource.products[0].id;
    try {
      const result = await getResourceReservationPrice(
        apiClient,
        resourceId,
        begin,
        end,
        userGroup,
        eventType,
        productId,
      );
      const data = result.data;
      this.props.setReservationPriceInfo(data);
      // this.props.dispatch(change(FormTypes.RESERVATION, 'product', data.product));
    } catch (error) {
      // TODO: Handle the error
    }
  }

  renderField(name, type, label, help = null, extraProps = {}) {
    const { autoComplete, externalName } = extraProps;

    if (!includes(this.props.fields, name)) {
      return null;
    }
    const isRequired = includes(this.props.requiredFields, name);

    return (
      <Field
        component={ReservationMetadataField}
        help={help}
        label={`${label}${isRequired ? '*' : ''}`}
        name={name}
        props={{
          autoComplete,
          externalName,
        }}
        type={type}
      />
    );
  }

  renderTermsField(name) {
    const { t, isStaff } = this.props;
    const labels = {
      termsAndConditions:
        // eslint-disable-next-line max-len
        `${t('ReservationInformationForm.termsAndConditionsLabel')} ${t('ReservationInformationForm.termsAndConditionsLink')}`,
      specificTerms: t('ReservationInformationForm.specificTermsLabel'),
    };
    const label = `${labels[name]}${isStaff ? '' : '*'}`;
    return (
      <Field
        component={TermsField}
        key={name}
        label={label}
        name={name}
        type="terms"
      />
    );
  }

  renderDropDown(name, label, options, isRequired) {
    return (
      <Field
        component={DropdownField}
        dropdownItems={options}
        key={name}
        label={`${label}${isRequired ? '*' : ''}`}
        name={name}
        onChange={this.handleUserGroupChange}
        type={name}
      />
    );
  }

  renderPaymentTermsField = () => {
    const { t, isStaff } = this.props;
    // eslint-disable-next-line max-len
    const label = `${t('ReservationInformationForm.paymentTermsAndConditionsLabel')} ${t('ReservationInformationForm.paymentTermsAndConditionsLink')}${isStaff ? '' : '*'}`;
    return (
      <Field
        component={TermsField}
        key="paymentTermsAndConditions"
        label={label}
        name="paymentTermsAndConditions"
        type="terms"
      />
    );
  }

  renderPaymentTimeLimitNote = () => {
    const { t } = this.props;
    return (
      <div className="wrapped-text payment-time-limit-note">
        {t('common.paymentTimeLimitNote')}
      </div>
    );
  }

  renderSubmitButton() {
    const {
      isMakingReservations,
      isPayableAmount,
      isPaymentRequired,
      resource,
      t,
    } = this.props;


    let buttonText;

    if (isPaymentRequired && isPayableAmount && !resource.needManualConfirmation) {
      buttonText = t('common.pay');
    } else if (isMakingReservations) {
      buttonText = t('common.saving');
    } else {
      buttonText = t('common.save');
    }

    return (
      <Button
        bsStyle="primary"
        disabled={isMakingReservations}
        type="submit"
      >
        {buttonText}
      </Button>
    );
  }

  render() {
    const {
      isEditing,
      isInvoiceRequested,
      fields,
      handleSubmit,
      onBack,
      onCancel,
      onConfirm,
      onChangeReservationType,
      requiredFields,
      resource,
      t,
      termsAndConditions,
      isPayableAmount,
      isPaymentRequired,
      isStaff,
      valid,
    } = this.props;

    const hasRequiredFields = !isEmpty(intersection(fields, requiredFields));

    const userGroupOptions = this.getUserGroupOptions();
    const eventTypeOptions = this.getEventTypeOptions();

    const hasUserGroupField = includes(fields, 'userGroup') && !isEmpty(userGroupOptions);
    const hasEventTypeField = includes(fields, 'eventType') && !isEmpty(eventTypeOptions);
    const hasInvoiceOptions = includes(fields, 'invoiceRequested');

    const hasPaymentOptionsFields = hasUserGroupField || hasEventTypeField;

    const showPaymentTimeLimitNote = isPaymentRequired && isPayableAmount && !resource.needManualConfirmation;

    return (
      <div>
        <Form
          className="reservation-form reservation-form-top-bottom"
          horizontal
          noValidate
          onSubmit={handleSubmit((values) => {
            // enforce validation on submit:
            // as fields can be dynamically added/removed, the usual validation on change
            // may not be run as expected
            // https://github.com/redux-form/redux-form/issues/3949
            return new Promise((resolve, reject) => {
              const errors = validate(values, this.props);
              if (!isEmpty(errors)) {
                reject(new SubmissionError(errors));
              } else {
                resolve(onConfirm(values));
              }
            });
          })}
        >
          {
            /**
             * Naming is a bit misleading in this case.
             * See: <root>/varaamo/app/state/selectors/authSelectors.js
             * isAdminSelector returns actually isStaff
             * and createIsStaffSelector returns isAdmin
             */
            isStaff && (
              <InternalReservationFields
                commentsMaxLengths={maxLengths.comments}
                onChangeReservationType={onChangeReservationType}
                valid={valid}
              />
            )
          }
          {hasRequiredFields && (
            <p className="app-ReservationPage__asteriskExplanation">
              {this.getAsteriskExplanation()}
            </p>
          )}
          {hasPaymentOptionsFields && (
            <div>
              <h2 className="app-ReservationPage__title app-ReservationPage__title__userAndPurpose">
                {t('ReservationInformationForm.userAndPurpose')}
              </h2>
              {hasUserGroupField && (
                <div>
                  {this.renderDropDown(
                    'userGroup',
                    t('ReservationInformationForm.userGroup'),
                    userGroupOptions,
                    true,
                  )}
                </div>
              )}
              {hasEventTypeField && (
                <div>
                  {this.renderDropDown(
                    'eventType',
                    t('ReservationInformationForm.eventType'),
                    eventTypeOptions,
                    true,
                  )}
                </div>
              )}
            </div>
          )}
          {hasInvoiceOptions && (
            <div>
              <Row>
                <Col md={1}>
                  <Field
                    component="input"
                    id="invoiceRequested__false"
                    label="invoiceRequested__false"
                    name="invoiceRequested"
                    onChange={this.handleInvoiceOption}
                    checked={!isInvoiceRequested}
                    value="off"
                    type="radio"
                  />
                </Col>
                <Col md={11}>
                  <label className="app-ReservationDetails__value" htmlFor="invoiceRequested__false">
                    {t('ReservationInformationForm.immediatePayment')}
                  </label>
                </Col>
              </Row>

              <Row>
                <Col md={1}>
                  <Field
                    component="input"
                    id="invoiceRequested__true"
                    label="invoiceRequested__false"
                    name="invoiceRequested"
                    onChange={this.handleInvoiceOption}
                    type="radio"
                    checked={isInvoiceRequested}
                    value="on"
                  />
                </Col>
                <Col md={11}>
                  <label className="app-ReservationDetails__value" htmlFor="invoiceRequested__true">
                    {t('ReservationInformationForm.invoicePayment')}
                  </label>
                </Col>
              </Row>

            </div>
          )}

          {includes(fields, 'reservationExtraQuestions')
            && this.renderField(
              'reservationExtraQuestions',
              'textarea',
              t('common.reservationExtraQuestions'),
              { rows: 5 },
            )
          }
          {includes(fields, 'reserverName') && (
            <h2 className="app-ReservationPage__title">
              {t('ReservationInformationForm.reserverInformationTitle')}
            </h2>
          )}
          {this.renderField(
            'reserverName',
            'text',
            t('common.reserverNameLabel'),
            null,
            { autoComplete: INPUT_PURPOSES.NAME, externalName: 'name' },
          )}

          {isInvoiceRequested && (
            <h2 className="app-ReservationPage__title">
              {t('ReservationInformationForm.companyInfo')}
            </h2>
          )}
          {this.renderField(
            'reserverId',
            'text',
            t('common.reserverIdLabel'),
          )}
          {this.renderField(
            'reserverPhoneNumber',
            'text',
            t('common.reserverPhoneNumberLabel'),
            null,
            { autoComplete: INPUT_PURPOSES.TEL, externalName: 'phone' },
          )}
          {this.renderField(
            'reserverEmailAddress',
            'email',
            t('common.reserverEmailAddressLabel'),
            null,
            { autoComplete: INPUT_PURPOSES.EMAIL, externalName: 'email' },
          )}
          {includes(fields, 'reserverAddressStreet')
            && this.renderField(
              'reserverAddressStreet',
              'text',
              t('common.addressStreetLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.STREET_ADDRESS, externalName: 'address' },
            )}
          {includes(fields, 'reserverAddressZip')
            && this.renderField(
              'reserverAddressZip',
              'text',
              t('common.addressZipLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.POSTAL_CODE, externalName: 'zip' },
            )}
          {includes(fields, 'reserverAddressCity')
            && this.renderField(
              'reserverAddressCity',
              'text',
              t('common.addressCityLabel'),
              null,
              { autoComplete: INPUT_PURPOSES.ADDRESS_LEVEL_2, externalName: 'city' },
            )
          }
          {includes(fields, 'billingAddressStreet')
            && <h2 className="app-ReservationPage__title">{t('common.billingAddressLabel')}</h2>
          }
          {includes(fields, 'billingAddressStreet')
            && this.renderField(
              'billingAddressStreet',
              'text',
              t('common.addressStreetLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.STREET_ADDRESS].join(' '), externalName: 'billing-address' },
            )
          }
          {includes(fields, 'billingAddressZip')
            && this.renderField(
              'billingAddressZip',
              'text',
              t('common.addressZipLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.POSTAL_CODE].join(' '), externalName: 'billing-zip' },
            )
          }
          {includes(fields, 'billingAddressCity')
            && this.renderField(
              'billingAddressCity',
              'text',
              t('common.addressCityLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.ADDRESS_LEVEL_2].join(' '), externalName: 'billing-city' },
            )
          }
          {includes(fields, 'company')
            && this.renderField(
              'company',
              'text',
              t('common.addressCompanyLabel'),
              null,
              { autoComplete: ['company', INPUT_PURPOSES.ORGANIZATION].join(' '), externalName: 'company' },
            )
          }
          {includes(fields, 'billingFirstName')
            && <h2 className="app-ReservationPage__title">{t('common.paymentInformationLabel')}</h2>
          }
          {includes(fields, 'billingFirstName')
            && this.renderField(
              'billingFirstName',
              'text',
              t('common.billingFirstNameLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.GIVEN_NAME].join(' '), externalName: 'billing-fname' },
            )
          }
          {includes(fields, 'billingLastName')
            && this.renderField(
              'billingLastName',
              'text',
              t('common.billingLastNameLabel'),
              null,
              { autoComplete: ['billing', INPUT_PURPOSES.FAMILY_NAME].join(' '), externalName: 'billing-lname' },
            )
          }
          {includes(fields, 'billingPhoneNumber')
            && this.renderField(
              'billingPhoneNumber',
              'tel',
              t('common.billingPhoneNumberLabel'),
              null,
              {
                autoComplete: ['billing', INPUT_PURPOSES.TEL].join(' '),
                externalName: ['billing', INPUT_PURPOSES.TEL].join('-'),
              },
            )
          }
          {includes(fields, 'billingEmailAddress')
            && this.renderField(
              'billingEmailAddress',
              'email',
              t('common.billingEmailAddressLabel'),
              null,
              {
                autoComplete: ['billing', INPUT_PURPOSES.EMAIL].join(' '),
                externalName: ['billing', INPUT_PURPOSES.EMAIL].join('-'),
              },
            )
          }
          {includes(fields, 'companyPhoneNumber')
            && this.renderField(
              'companyPhoneNumber',
              'tel',
              t('common.companyPhoneNumberLabel'),
              null,
              {
                autoComplete: ['company', INPUT_PURPOSES.TEL].join(' '),
                externalName: ['company', INPUT_PURPOSES.TEL].join('-'),
              },
            )
          }
          {includes(fields, 'companyEmailAddress')
            && this.renderField(
              'companyEmailAddress',
              'email',
              t('common.companyEmailAddressLabel'),
              null,
              {
                autoComplete: ['company', INPUT_PURPOSES.EMAIL].join(' '),
                externalName: ['company', INPUT_PURPOSES.EMAIL].join('-'),
              },
            )
          }

          {includes(fields, 'companyAddressStreet')
            && <h2 className="app-ReservationPage__title">{t('common.companyAddressLabel')}</h2>
          }
          {includes(fields, 'companyAddressStreet')
            && this.renderField(
              'companyAddressStreet',
              'text',
              t('common.companyAddressStreetLabel'),
              null,
              { autoComplete: ['company', INPUT_PURPOSES.STREET_ADDRESS].join(' '), externalName: 'company-address' },
            )
          }
          {includes(fields, 'companyAddressZip')
            && this.renderField(
              'companyAddressZip',
              'text',
              t('common.companyAddressZipLabel'),
              null,
              { autoComplete: ['company', INPUT_PURPOSES.POSTAL_CODE].join(' '), externalName: 'company-zip' },
            )
          }
          {includes(fields, 'companyAddressCity')
            && this.renderField(
              'companyAddressCity',
              'text',
              t('common.companyAddressCityLabel'),
              null,
              { autoComplete: ['company', INPUT_PURPOSES.ADDRESS_LEVEL_2].join(' '), externalName: 'company-city' },
            )
          }

          <h2 className="app-ReservationPage__title">{t('ReservationInformationForm.eventInformationTitle')}</h2>
          {includes(fields, 'eventSubject') && (
            <ReservationInformationNotification
              labelText={t('ReservationForm.publicFieldsNoticeLabel')}
            >
              {t('ReservationForm.publicFieldsNotice')}
            </ReservationInformationNotification>
          )}
          {this.renderField(
            'eventSubject',
            'text',
            t('common.eventSubjectLabel'),
            {},
            t('ReservationForm.eventSubjectInfo'),
          )}
          {this.renderField(
            'eventDescription',
            'textarea',
            t('common.eventDescriptionLabel'),
            { rows: 5 },
          )}
          {this.renderField(
            'numberOfParticipants',
            'number',
            t('common.numberOfParticipantsLabel'),
            { min: '0' },
          )}
          {termsAndConditions
            && (
              <React.Fragment>
                <h2 className="app-ReservationPage__title">{t('ReservationTermsModal.resourceTermsTitle')}</h2>
                <div className="terms-box">
                  <WrappedText text={resource.genericTerms} />
                </div>
                {this.renderTermsField('termsAndConditions')}
              </React.Fragment>
            )
          }
          {includes(fields, 'paymentTermsAndConditions')
            && (
              <React.Fragment>
                <h2 className="app-ReservationPage__title">{t('paymentTerms.title')}</h2>
                <div className="terms-box">
                  <WrappedText text={resource.paymentTerms} />
                </div>
                {this.renderPaymentTermsField()}
              </React.Fragment>
            )
          }
          {includes(fields, 'specificTerms') && (
            <div>
              <h2 className="app-ReservationPage__title">{t('ReservationForm.specificTermsTitle')}</h2>
              <WrappedText className="specificTermsContent" text={resource.specificTerms} />
              {this.renderTermsField('specificTerms')}
            </div>
          )}
          {showPaymentTimeLimitNote && this.renderPaymentTimeLimitNote()}
          <div>
            <Button
              onClick={onCancel}
            >
              {isEditing ? t('ReservationInformationForm.cancelEdit') : t('common.cancel')}
            </Button>
            {isEditing
              && (
                <Button
                  bsStyle="default"
                  onClick={onBack}
                >
                  {t('common.previous')}
                </Button>
              )
            }
            {this.renderSubmitButton()}
          </div>
        </Form>
      </div>
    );
  }
}

UnconnectedReservationInformationForm.propTypes = {
  fields: PropTypes.array.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  isInvoiceRequested: PropTypes.bool.isRequired,
  isMakingReservations: PropTypes.bool.isRequired,
  isPayableAmount: PropTypes.bool.isRequired,
  isPaymentRequired: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onChangeReservationType: PropTypes.func.isRequired,
  onChangeInvoiceRequested: PropTypes.func.isRequired,
  requiredFields: PropTypes.array.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  termsAndConditions: PropTypes.string.isRequired,
  isStaff: PropTypes.bool.isRequired,
  valid: PropTypes.bool.isRequired,
  selectedTime: PropTypes.object.isRequired,
  setReservationPriceInfo: PropTypes.func.isRequired,
};
UnconnectedReservationInformationForm = injectT(UnconnectedReservationInformationForm);  // eslint-disable-line

export { UnconnectedReservationInformationForm };

// eslint-disable-next-line import/no-mutable-exports
let ConnectedReservationInformationForm = UnconnectedReservationInformationForm;

ConnectedReservationInformationForm = injectT(reduxForm({
  form: FormTypes.RESERVATION,
})(ConnectedReservationInformationForm));

ConnectedReservationInformationForm = connect(
  (state) => {
    const resource = state.ui.reservations.toEdit.length > 0
      ? state.ui.reservations.toEdit[0].resource
      : state.ui.reservations.selected[0].resource;
    const products = state.data.resources[resource].products;
    const product = !isEmpty(products) && products[0].id;
    return {
      initialValues: {
        internalReservation: true,
        reservationExtraQuestionsDefault: state.data.resources[resource].reservationExtraQuestions,
        reservationExtraQuestions: state.data.resources[resource].reservationExtraQuestions,
        product,
        ...toCamelCase(state.ui.reservations.toEdit[0]),
      },
      onChange: (obj) => {
        /**
         * We separate creating new reservation and editing existing reservation with !obj.resource check.
         * If we clear reservationExtraQuestions in the first place default reservationExtraQuestions is returned.
         * We can override default value when editing existing reservation.
         */
        if (obj.reservationExtraQuestions === '' && !obj.resource) {
          // eslint-disable-next-line no-param-reassign
          obj.reservationExtraQuestions = obj.reservationExtraQuestionsDefault;
        }
      },
      validate,
    };
  },
)(ConnectedReservationInformationForm);

export default ConnectedReservationInformationForm;
