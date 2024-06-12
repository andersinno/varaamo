import React, { useState, useEffect } from 'react';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/lib/Modal';
import Button from 'react-bootstrap/lib/Button';

import { createNotification } from '../../../../src/common/notification/utils';
import { NOTIFICATION_TYPE } from '../../../../src/common/notification/constants';
import client from '../../../../src/common/api/client';
import injectT from '../../../i18n/injectT';

function UserEmailFormModal({ userId, show, t }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [emailMismatch, setEmailMismatch] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    confirmEmail: '',
  });

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setEmailMismatch(false);
    setError(false);

    if (formData.email && formData.email === formData.confirmEmail) {
      client.post(`user/${userId}/set_email`, { email: formData.email })
        .then(() => {
          createNotification(NOTIFICATION_TYPE.SUCCESS, t('UserEmailForm.emailSet'));
          setOpen(false);
        })
        .catch((e) => {
          setError(true);
          createNotification(NOTIFICATION_TYPE.ERROR, t('UserEmailForm.failedToSetEmail'));
        });
    } else {
      setEmailMismatch(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Modal
      backdrop="static"
      className="app-UserEmailFormModal"
      keyboard={false}
      show={open}
    >
      <Modal.Header>
        <Modal.Title>
          {t('UserEmailForm.title')}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{t('UserEmailForm.text')}</p>
        <p>{t('UserEmailForm.text2')}</p>
        <br />
        <Form id="user-email-form" onSubmit={handleSubmit}>
          <FormGroup controlId="textField-email">
            <ControlLabel className="app-TextField__label">
              {t('UserEmailForm.emailFieldLabel')}
            </ControlLabel>
            <FormControl
              autoFocus
              className="app-TextField__input"
              name="email"
              onChange={handleChange}
              required
              type="email"
              value={formData.email}
            />
            <FormControl.Feedback />
          </FormGroup>
          <FormGroup controlId="textField-confirmEmail">
            <ControlLabel className="app-TextField__label">
              {t('UserEmailForm.emailField2Label')}
            </ControlLabel>
            <FormControl
              className="app-TextField__input"
              name="confirmEmail"
              onChange={handleChange}
              required
              type="email"
              value={formData.confirmEmail}
            />
            <FormControl.Feedback />
          </FormGroup>
        </Form>
        {emailMismatch && (
          <p className="emailMismatchErrorMessage">
            {t('UserEmailForm.emailMismatchError')}
          </p>
        )}
        {error && (
          <p className="errorMessage">
            {t('UserEmailForm.failedToSetEmail')}
          </p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button form="user-email-form" type="submit" variant="primary">
          {t('UserEmailForm.confirmButton')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

UserEmailFormModal.propTypes = {
  userId: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(UserEmailFormModal);
