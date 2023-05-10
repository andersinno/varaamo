import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash/lang';

import { RESERVATION_TYPE } from '../../../../src/domain/reservation/constants';
import injectT from '../../../i18n/injectT';
import FormTypes from '../../../constants/FormTypes';
import { toCamelCase } from '../../../../src/common/data/utils';

class InternalReservationFields extends Component {
  render() {
    const {
      t,
      commentsMaxLengths,
      valid,
    } = this.props;

    return (
      <div className="app-ReservationDetails">
        <h2 className="app-ReservationPage__title">{t('ReservationForm.premiseStaffOnly')}</h2>

        <Row>
          <Col md={1}>
            <Field
              component="input"
              id="type__internalUse"
              label="type__internalUse"
              name="type"
              type="radio"
              value={RESERVATION_TYPE.INTERNAL_USE}
            />
          </Col>
          <Col md={11}>
            <label className="app-ReservationDetails__value" htmlFor="type__internalUse">
              {t('ReservationForm.typeInternalUse')}
              <br />
              {t('ReservationForm.typeInternalUseDescription')}
            </label>
          </Col>
        </Row>

        <Row>
          <Col md={1}>
            <Field
              component="input"
              id="type__blocked"
              label="type__blocked"
              name="type"
              type="radio"
              value={RESERVATION_TYPE.BLOCKED}
            />
          </Col>
          <Col md={11}>
            <label className="app-ReservationDetails__value" htmlFor="type__blocked">
              {t('ReservationForm.typeBlocked')}
              <br />
              {t('ReservationForm.typeBlockedDescription')}
            </label>
          </Col>
        </Row>

        <Row>
          <Col md={1}>
            <Field
              component="input"
              id="type__forCustomer"
              label="type__forCustomer"
              name="type"
              type="radio"
              value={RESERVATION_TYPE.FOR_CUSTOMER}
            />
          </Col>
          <Col md={11}>
            <label className="app-ReservationDetails__value" htmlFor="type__forCustomer">
              {t('ReservationForm.typeForCustomer')}
              <br />
              {t('ReservationForm.typeForCustomerDescription')}
            </label>
          </Col>
        </Row>

        {/* }

        <Row>
          <Col md={1}>
            <Field
              component="input"
              id="type__normal"
              label="type__normal"
              name="type"
              type="radio"
              value="normal"
            />
          </Col>
          <Col md={11}>
            <label className="app-ReservationDetails__value" htmlFor="type__normal">
              {t('ReservationForm.typeNormal')}
              <br />
              {t('ReservationForm.typeNormalDescription')}
            </label>
          </Col>
        </Row>

        { */}

        <Row>
          <Col md={12}>
            <div className="app-ReservationPage__formfield">
              <span>
                {t('common.comments')}
              </span>
              <Field
                component="textarea"
                label="comments"
                maxLength={commentsMaxLengths}
                name="comments"
                rows={5}
              />
              {
                !valid
                && (
                <span className="app-ReservationPage__error">
                  {t('ReservationForm.maxLengthError', { maxLength: commentsMaxLengths })}
                </span>
                )
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

InternalReservationFields.propTypes = {
  t: PropTypes.func.isRequired,
  commentsMaxLengths: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired,
};

// eslint-disable-next-line import/no-mutable-exports
let ConnectedReservationFields = InternalReservationFields;

ConnectedReservationFields = injectT(reduxForm({
  form: FormTypes.RESERVATION,
})(ConnectedReservationFields));

ConnectedReservationFields = connect(
  (state) => {
    const resource = state.ui.reservations.toEdit.length > 0
      ? state.ui.reservations.toEdit[0].resource
      : state.ui.reservations.selected[0].resource;
    const products = state.data.resources[resource].products;
    const product = !isEmpty(products) && products[0].id;
    return {
      initialValues: {
        staffEvent: true,
        type: RESERVATION_TYPE.INTERNAL_USE,
        reservationExtraQuestionsDefault: state.data.resources[resource].reservationExtraQuestions,
        reservationExtraQuestions: state.data.resources[resource].reservationExtraQuestions,
        product,
        ...toCamelCase(state.ui.reservations.toEdit[0]),
      },
    };
  },
)(ConnectedReservationFields);

export default ConnectedReservationFields;
