import React from 'react';
import toJson from 'enzyme-to-json';
import simple from 'simple-mock';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import * as customizationUtils from '../../../../app/utils/customizationUtils';
import AboutPage from '../AboutPage';

describe('pages/about/AboutPage', () => {
  beforeAll(() => {
    simple.mock(customizationUtils, 'getCurrentCustomization').returnWith(undefined);
  });

  test('render normally', () => {
    const wrapper = shallowWithIntl(<AboutPage />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
