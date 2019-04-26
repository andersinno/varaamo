import { shallow } from 'enzyme';
import React from 'react';
import simple from 'simple-mock';

import * as customizationUtils from 'utils/customizationUtils';
import Favicon from './Favicon';
import espooFavicon from './espoo-favicon.ico';
import vantaaFavicon from './vantaa-favicon.ico';
import helsinkiFavicon from './helsinki-favicon.ico';
import tampereFavicon from './tampere-favicon.ico';

describe('shared/favicon/Favicon', () => {
  function getWrapper() {
    return shallow(<Favicon />);
  }

  describe('When there is no customization in use', () => {
    let favicon;

    beforeAll(() => {
      favicon = getWrapper();
    });

    test('renders favicon of Helsinki', () => {
      expect(favicon.prop('link')[0].href).toEqual(helsinkiFavicon);
    });
  });

  describe('When Espoo customization is used', () => {
    let favicon;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('ESPOO');
      favicon = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders favicon of Espoo', () => {
      expect(favicon.prop('link')[0].href).toEqual(espooFavicon);
    });
  });

  describe('When Vantaa customization is used', () => {
    let favicon;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('VANTAA');
      favicon = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    test('renders favicon of Vantaa', () => {
      expect(favicon.prop('link')[0].href).toEqual(vantaaFavicon);
    });
  });

  describe('When Tampere customization is used', () => {
    let favicon;

    beforeAll(() => {
      simple.mock(customizationUtils, 'getCurrentCustomization').returnWith('TAMPERE');
      favicon = getWrapper();
    });

    afterAll(() => {
      simple.restore();
    });

    it('renders favicon of Tampere', () => {
      expect(favicon.prop('link')[0].href).toEqual(tampereFavicon);
    });
  });
});
