import React from 'react';
import { expect } from 'chai';

import { shallowWithIntl } from 'utils/testUtils';
import EspooPartners from './EspooPartners';
import aikaLogoSrc from './images/aika-logo.png';
import eakrLogoSrc from './images/eakr-logo.png';
import euVipuvoimaaLogoSrc from './images/eu-vipuvoimaa-logo.png';

describe('pages/about/EspooPartners', () => {
  function getWrapper() {
    return shallowWithIntl(<EspooPartners />);
  }

  it('renders div.about-page-logos', () => {
    const div = getWrapper().find('div.about-page-logos');
    expect(div).to.have.length(1);
  });

  describe('images', () => {
    let images;

    before(() => {
      images = getWrapper().find('img');
    });

    it('contains 3 images', () => {
      expect(images).to.have.length(3);
    });

    it('has 6 aika image', () => {
      expect(images.find({
        alt: 'EspooPartners.aikaLogoAlt',
        src: aikaLogoSrc,
      })).to.have.length(1);
    });

    it('has EU Vipuvoimaa image', () => {
      expect(images.find({
        alt: 'EspooPartners.euVipuvoimaaLogoAlt',
        src: euVipuvoimaaLogoSrc,
      })).to.have.length(1);
    });

    it('has eakr image', () => {
      expect(images.find({
        alt: 'EspooPartners.eakrLogoAlt',
        src: eakrLogoSrc,
      })).to.have.length(1);
    });
  });
});
