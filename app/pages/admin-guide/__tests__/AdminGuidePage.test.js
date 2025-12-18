import React from 'react';

import PageWrapper from '../../PageWrapper';
import { shallowWithIntl } from '../../../utils/testUtils';
import { UnconnectedAdminGuidePage as AdminGuidePage } from '../AdminGuidePage';

describe('pages/admin-guide/AdminGuidePage', () => {
  const defaultProps = {
    isAdmin: true,
    isLoggedin: true,
    currentLanguage: 'fi',
  };

  function getWrapper(extraProps = {}) {
    return shallowWithIntl(<AdminGuidePage {...defaultProps} {...extraProps} />);
  }

  describe('render', () => {
    test('renders PageWrapper with correct title', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).toHaveLength(1);
      expect(pageWrapper.prop('title')).toBe('AdminGuidePage.title');
    });

    test('renders instructions', () => {
      const wrapper = getWrapper();
      const instructions = [
        {
          'id': 1,
          'applicable_for': 'admin',
          'content': '<h1>Admin instructions</h1>\r\n\r\n<p>Lorem ipsum</p>',
        },
        {
          'id': 2,
          'applicable_for': 'admin',
          'content': '<h1>Other instructions</h1>\r\n\r\n<p>Lorem ipsum</p>',
        },
      ];

      wrapper.setState({ instructions });

      expect(wrapper.find('.app-adminGuidePage__instructions')).toHaveLength(2);
    });
  });

  describe('componentDidMount', () => {
    test('fetches data', () => {
      const wrapperInstance = getWrapper().instance();
      const fetchInstructionsSpy = jest.spyOn(wrapperInstance, 'fetchInstructions').mockResolvedValue([]);

      wrapperInstance.componentDidMount();

      expect(fetchInstructionsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
