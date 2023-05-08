import PropTypes from 'prop-types';
import React from 'react';

import NumericalProgressSteps from '../../../shared/progress-steps/NumericalProgressSteps';
import injectT from '../../../i18n/injectT';

ReservationPhases.propTypes = {
  currentPhase: PropTypes.string.isRequired,
  isEditing: PropTypes.bool,
  isPaymentRequired: PropTypes.bool,
  t: PropTypes.func.isRequired,
};

const phases = {
  information: 'ReservationPhase.informationTitle',
  confirmation: 'ReservationPhase.confirmationTitle',
  time: 'ReservationPhase.timeTitle',
  payment: 'ReservationPhase.paymentTitle',
};

function ReservationPhases({
  currentPhase,
  isEditing,
  isPaymentRequired,
  t,
}) {
  let stepMessageIds = isPaymentRequired
    ? ['information', 'payment', 'confirmation']
    : ['information', 'confirmation'];

  if (isEditing) {
    stepMessageIds = ['time', ...stepMessageIds];
  }

  const steps = stepMessageIds.map(id => t(phases[id]));
  const current = t(phases[currentPhase]);

  return (
    <NumericalProgressSteps
      activeStep={current}
      className="app-ReservationPage__phases"
      steps={steps}
    />
  );
}

export default injectT(ReservationPhases);
