import React from 'react';

import { shallowWithIntl } from '../../../../app/utils/testUtils';
import { UnconnectedAboutPage as AboutPage } from '../AboutPage';

describe('pages/about/AboutPage', () => {
  const defaultProps = { currentLanguage: 'fi' };
  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<AboutPage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders instructions', () => {
      const wrapper = getWrapper();
      const instructions = [
        {
          'id': 1,
          'applicable_for': 'user',
          'content': '<h1>User instructions</h1>\r\n\r\n<p>Lorem ipsum</p>',
        },
        {
          'id': 2,
          'applicable_for': 'user',
          'content': '<h1>Other instructions</h1>\r\n\r\n<p>Lorem ipsum</p>',
        },
      ];

      wrapper.setState({ instructions });

      expect(wrapper.html()).toContain('class="about-page"');
      expect(wrapper.find('.app-aboutPage__instructions')).toHaveLength(2);
    });
  });

  describe('componentDidMount', () => {
    test('fetches data', () => {
      const instance = getWrapper().instance();
      instance.fetchInstructions = jest.fn().mockImplementation(() => (
        [{ id: 1, content: { fi: 'Finnish content' } }]
      ));
      const fetchInstructionsSpy = jest.spyOn(instance, 'fetchInstructions');

      instance.componentDidMount();

      expect(fetchInstructionsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
