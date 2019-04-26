import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import AboutPageContent from './AboutPageContent';

describe('Component: customization/AboutPageContent', () => {
  function getWrapper() {
    return shallowWithIntl(<AboutPageContent />);
  }

  describe('When there is no customization in use', () => {
    let content;

    beforeAll(() => {
      content = getWrapper();
    });

    test('renders header for Helsinki', () => {
      expect(content.find('h1').text()).toContain('AboutPageContent.defaultHeader');
    });
  });

  describe('When Espoo customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders header for Espoo', () => {
      expect(content.find('h1').text()).toContain('AboutPageContent.espooHeader');
    });
  });

  describe('When Vantaa customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders header for Vantaa', () => {
      expect(content.find('h1').text()).toContain('AboutPageContent.vantaaHeader');
    });
  });

  describe('When Tampere customization is used', () => {
    let content;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('TAMPERE');
      content = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    it('renders header for Tampere', () => {
      expect(content.find('h1').text()).toContain('AboutPageContent.tampereHeader');
    });
  });
});
