import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import ResourceReservationButton from '../ResourceReservationButton';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceReservationButton', () => {
  test('renders correctly', () => {
    const props = {
      resource: resource.build({ authentication: 'strong' }),
      isLoggedIn: true,
      t: jest.fn(),
      onReserve: jest.fn(),
      loginMethod: 'google',
      selected: {},
    };

    const wrapper = shallowWithIntl(
      <ResourceReservationButton {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
