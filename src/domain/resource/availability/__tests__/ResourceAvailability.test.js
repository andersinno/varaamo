import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import ResourceAvailability from '../ResourceAvailability';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceAvailability', () => {
  test('renders correctly', () => {
    const props = {
      date: '2019-07-30',
      resource: resource.build(),
    };
    const wrapper = shallowWithIntl(
      <ResourceAvailability {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });
  test('renders external reservation correctly', () => {
    const props = {
      resource: resource.build(
        { external_reservation_url: 'https://somewhere.external.com' },
      ),
    };

    const wrapper = shallowWithIntl(<ResourceAvailability {...props} />);
    const resourceAvailibility = wrapper.find('Label');
    const resourceAvailibilityHtmlText = resourceAvailibility.html();

    expect(resourceAvailibilityHtmlText).toContain('ResourceAvailability.externalReservation');
  });

  test('renders temporarily closed correctly', () => {
    const props = {
      resource: resource.build(
        { temporarily_closed: true },
      ),
    };

    const wrapper = shallowWithIntl(<ResourceAvailability {...props} />);
    const resourceAvailibility = wrapper.find('Label');
    const resourceAvailibilityHtmlText = resourceAvailibility.html();

    expect(resourceAvailibilityHtmlText).toContain('ResourceAvailability.temporarilyClosed');
  });
});
