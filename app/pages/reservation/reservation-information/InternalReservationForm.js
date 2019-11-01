import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';
import FormTypes from '../../../constants/FormTypes';

class UnconnectedInternalReservationForm extends Component {
  render() {
    const {
      t,
      commentsMaxLengths,
      valid
    } = this.props;
    return (
      <div className="app-ReservationDetails">
        <h2 className="app-ReservationPage__title">{t('ReservationForm.premiseStaffOnly')}</h2>
        <Row>
          <Col md={1}>
            <Field
              component="input"
              id="internalReservationChecked"
              label="internalReservation"
              name="internalReservation"
              type="checkbox"
            />
          </Col>
          <Col md={11}>
            <span className="app-ReservationDetails__value">
              {t('ReservationForm.internalReservation')}
              <br />
              {t('ReservationForm.internalReservationDescription')}
            </span>
          </Col>
        </Row>
        <Row>
          <Col md={1}>
            <Field
              component="input"
              label="markAsClosed"
              name="markAsClosed"
              type="checkbox"
            />
          </Col>
          <Col md={11}>
            <span className="app-ReservationDetails__value">
              {t('ReservationForm.markAsClosed')}
              <br />
              {t('ReservationForm.markAsClosedDescription')}
            </span>
          </Col>
        </Row>
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

UnconnectedInternalReservationForm.propTypes = {
  t: PropTypes.func.isRequired,
  commentsMaxLengths: PropTypes.number.isRequired,
  valid: PropTypes.bool.isRequired
};

export default injectT(reduxForm({
  form: FormTypes.RESERVATION,
  initialValues: { internalReservation: true }
})(UnconnectedInternalReservationForm));
