import React from 'react';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import { UnconnectedAboutPage as AboutPage } from '../AboutPage';

describe('pages/about/AboutPage', () => {
  const defaultProps = { currentLanguage: 'fi' };
  function getWrapper(props) {
    return shallowWithIntl(<AboutPage {...defaultProps} {...props} />);
  }

  test('render normally', () => {
    const wrapper = getWrapper();
    const instance = wrapper.instance();
    instance.fetchInstructions = jest.fn().mockImplementation(() => (
      [{ id: 1, content: { fi: 'Finnish content' } }]
    ));
    instance.componentDidMount();

    expect(wrapper.html()).toContain('class="about-page"');
  });
});
