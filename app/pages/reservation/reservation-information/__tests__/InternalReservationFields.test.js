import React from 'react';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../../utils/testUtils';
import { UnconnectedInternalReservationFields } from '../InternalReservationFields';


describe('pages/reservation/reservation-information/InternalReservationFields', () => {
  const defaultProps = {
    commentsMaxLengths: 100,
    onChangeReservationType: simple.mock(),
    valid: true,
  };

  const getWrapper = (extraProps) => {
    return shallowWithIntl(<UnconnectedInternalReservationFields {...defaultProps} {...extraProps} />);
  };

  test('handle change reservation type', () => {
    const instance = getWrapper({}).instance();
    instance.handleChangeReservationType({
      target: {
        value: 'normal',
      },
    });
    expect(instance.props.onChangeReservationType.lastCall.args[0]).toBe('normal');
  });
});
