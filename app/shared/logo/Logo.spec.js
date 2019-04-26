import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import { shallowWithIntl } from 'utils/testUtils';
import Logo from './Logo';
import espooLogoSrc from './espoo-blue-logo.png';
import vantaaLogoSrc from './vantaa-logo.png';
import helsinkiLogoSrc from './helsinki-logo-white.png';
import tampereLogoSrc from './tampere-logo.png';

describe('shared/logo/Logo', () => {
  function getWrapper() {
    return shallowWithIntl(<Logo />);
  }

  describe('When there is no customization in use', () => {
    let logo;

    beforeAll(() => {
      logo = getWrapper();
    });

    test('renders logo of Helsinki', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(helsinkiLogoSrc);
    });

    test('renders Helsinki alt text', () => {
      expect(logo.props().alt).toBe('Logo.helsinkiAlt');
    });
  });

  describe('When Espoo customization is used', () => {
    let logo;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      logo = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders logo of Espoo', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(espooLogoSrc);
    });

    test('renders Espoo alt text', () => {
      expect(logo.props().alt).toBe('Logo.espooAlt');
    });
  });

  describe('When Vantaa customization is used', () => {
    let logo;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      logo = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders logo of Vantaa', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(vantaaLogoSrc);
    });

    test('renders Vantaa alt text', () => {
      expect(logo.props().alt).toBe('Logo.vantaaAlt');
    });
  });

  describe('When Tampere customization is used', () => {
    let logo;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('TAMPERE');
      logo = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    it('renders logo of Tampere', () => {
      expect(logo.type()).toBe('img');
      expect(logo.props().src).toBe(tampereLogoSrc);
    });

    it('renders Tampere alt text', () => {
      expect(logo.props().alt).toBe('Logo.tampereAlt');
    });
  });
});
