import React from 'react';

import { mountWithIntl } from '../../../../utils/testUtils';
import ReservationPhases from '../ReservationPhases';
import NumericalProgressSteps from '../../../../shared/progress-steps/NumericalProgressSteps';
import NumericalStep from '../../../../shared/progress-steps/NumericalStep';

describe('pages/reservation/reservation-phases/ReservationPhases', () => {
  const defaultProps = {
    currentPhase: 'information',
    isEditing: false,
    isPaymentRequired: false,
  };

  function getWrapper(extraProps) {
    return mountWithIntl(<ReservationPhases {...defaultProps} {...extraProps} />);
  }

  test('uses ProgressSteps under the hood', () => {
    const wrapper = getWrapper();
    const progressStepsComponent = wrapper.find(NumericalProgressSteps);
    expect(progressStepsComponent).toHaveLength(1);
  });

  test('when not editing', () => {
    const wrapper = getWrapper();
    const steps = wrapper.find(NumericalStep);
    expect(steps).toHaveLength(2);
    expect(steps.at(0).prop('isActive')).toBe(true);
    expect(steps.at(1).prop('isActive')).toBe(false);
  });

  test('renders three phases when editing', () => {
    const wrapper = getWrapper({
      currentPhase: 'information',
      isEditing: true,
      isPaymentRequired: false,
    });
    const steps = wrapper.find(NumericalStep);
    expect(steps).toHaveLength(3);
    expect(steps.at(0).prop('isActive')).toBe(false);
    expect(steps.at(1).prop('isActive')).toBe(true);
    expect(steps.at(2).prop('isActive')).toBe(false);
    expect(steps.at(0).prop('label')).toBe('ReservationPhase.timeTitle');
  });

  test('renders payment phase when payment required', () => {
    const wrapper = getWrapper({
      currentPhase: 'information',
      resource: {
        products: [{}],
      },
      isPaymentRequired: true,
      isEditing: false,
    });
    const steps = wrapper.find(NumericalStep);
    expect(steps).toHaveLength(3);
    expect(steps.at(1).prop('label')).toBe('ReservationPhase.paymentTitle');
  });
});
