import React from 'react';
import Immutable from 'seamless-immutable';

import Resource from '../../../../utils/fixtures/Resource';
import { shallowWithIntl } from '../../../../utils/testUtils';
import WrappedText from '../../../../shared/wrapped-text/WrappedText';
import ReservationInfo from '../ReservationInfo';

describe('pages/resource/reservation-info/ReservationInfo', () => {
  const defaultProps = {
    isLoggedIn: false,
    resource: Immutable(
      Resource.build({
        maxPeriod: '04:00:00',
        maxReservationsPerUser: 2,
        reservable: true,
        reservableAfter: '2019-03-06T00:00:00Z',
        reservationInfo: 'Some information',
        reservableMinDaysInAdvance: 2,
        reservableMaxDaysInAdvance: 90,
      }),
    ),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ReservationInfo {...defaultProps} {...props} />);
  }

  test('renders a app-ReservationInfo', () => {
    const element = getWrapper().find('.app-ReservationInfo');
    expect(element.length).toBe(1);
  });

  test('renders resource.reservationInfo as WrappedText', () => {
    const wrappedText = getWrapper().find(WrappedText);
    expect(wrappedText.length).toBe(1);
    expect(wrappedText.props().text).toBe(defaultProps.resource.reservationInfo);
    expect(wrappedText.props().openLinksInNewTab).toBe(true);
  });

  describe('earliest reservation day text', () => {
    test('is rendered correctly when resource.reservableMinDaysInAdvance is defined', () => {
      const resAfterText = getWrapper().find('.reservable-after-text');
      expect(resAfterText).toHaveLength(1);
    });

    test('is not rendered if resource.reservableMinDaysInAdvance is not defined', () => {
      const resource = {};
      const maxLengthText = getWrapper({ resource }).find('.reservable-after-text');
      expect(maxLengthText).toHaveLength(0);
    });
  });

  describe('latest reservation day test', () => {
    test('is rendered correctly when resource.reservableMaxDaysInAdvance is defined', () => {
      const resLatestText = getWrapper().find('.reservable-before-text');
      expect(resLatestText).toHaveLength(1);
    });

    test('is not rendered if resource.reservableMaxDaysInAdvance is not defined', () => {
      const resource = {};
      const resLatestText = getWrapper({ resource }).find('.reservable-before-text');
      expect(resLatestText).toHaveLength(0);
    });
  });

  describe('max length text', () => {
    test('is rendered correctly when resource.maxPeriod is defined', () => {
      const maxLengthText = getWrapper().find('.max-length-text');
      expect(maxLengthText).toHaveLength(1);
    });

    test('is not rendered if resource.maxPeriod is not defined', () => {
      const resource = {};
      const maxLengthText = getWrapper({ resource }).find('.max-length-text');
      expect(maxLengthText).toHaveLength(0);
    });
  });

  describe('max reservations per user text', () => {
    test(
      'is rendered correctly when resource.maxReservationsPerUser is defined',
      () => {
        const maxReservationsText = getWrapper().find('.max-number-of-reservations-text');
        expect(maxReservationsText).toHaveLength(1);
      },
    );

    test(
      'is not rendered if resource.maxReservationsPerUser is not defined',
      () => {
        const resource = {};
        const maxReservationsText = getWrapper({ resource }).find('.max-number-of-reservations-text');
        expect(maxReservationsText).toHaveLength(0);
      },
    );
  });

  describe('login text', () => {
    test('is not rendered if user is logged in', () => {
      const loginText = getWrapper({ isLoggedIn: true }).find('.login-text');
      expect(loginText).toHaveLength(0);
    });

    test('is not rendered if resource is not reservable', () => {
      const resource = {
        reservable: false,
      };
      const loginText = getWrapper({ resource }).find('.login-text');
      expect(loginText).toHaveLength(0);
    });

    test('is rendered otherwise', () => {
      const resource = {
        reservable: true,
      };
      const loginText = getWrapper({ isLoggedIn: false, resource }).find('.login-text');
      expect(loginText).toHaveLength(1);
    });
  });

  describe('reservation period text', () => {
    test(
      'has minimum and maximum hours rendered if not reservable for whole day',
      () => {
        const resource = { maxPeriod: '04:00:00', minPeriod: '03:00:00' };
        const wrapper = getWrapper({ resource });
        const minReservationPeriodParagraph = wrapper.find('.app-ResourcePage__content-min-period');
        const maxReservationPeriodParagraph = wrapper.find('.max-length-text');
        const wholeDayReservationParagraph = wrapper.find('.app-ResourcePage__content-whole-day-reservation');

        expect(minReservationPeriodParagraph).toHaveLength(1);
        expect(maxReservationPeriodParagraph).toHaveLength(1);
        expect(wholeDayReservationParagraph).toHaveLength(0);
      },
    );

    test(
      'reservation for whole day info rendered if reservable for whole day',
      () => {
        const resource = { minPeriod: '03:00:00', shouldBeReservedWholeDay: true };
        const wrapper = getWrapper({ resource });
        const maxReservationPeriodParagraph = wrapper.find('.max-length-text');
        const wholeDayReservationParagraph = wrapper.find('.app-ResourcePage__content-whole-day-reservation');

        expect(wholeDayReservationParagraph).toHaveLength(1);
        expect(maxReservationPeriodParagraph).toHaveLength(0);
      },
    );
  });
});
