import React from 'react';
import toJson from 'enzyme-to-json';
import moment from 'moment';

import TimePickerCalendar from '../TimePickerCalendar';
import resource from '../../data/fixtures/resource';
import reservation from '../../data/fixtures/reservation';
import { globalDateMock, shallowWithIntl } from '../../../../app/utils/testUtils';

describe('Calendar reservation selection', () => {
  // Change the date so that test runs with this 'now'.
  Date.now = jest.fn(() => new Date('2019-12-17T11:00:00+03:00'));
  const defaultProps = {
    resource: resource.build(),
    date: '2019-08-15',
    isStaff: false,
    onDateChange: jest.fn(),
    onReserve: jest.fn(),
    onTimeChange: jest.fn(),
  };
  const selectedInvalidSlot = {
    start: moment('2019-12-17T17:00:00.000Z').toDate(),
    end: moment('2019-12-17T18:00:00.000Z').toDate(),
  };
  const resourceOpeningHours = [{
    date: '2019-12-17',
    opens: '2019-12-17T09:00:00.000Z',
    closes: '2019-12-17T18:00:00.000Z',
  }];
  const userResource = resource.build({
    opening_hours: resourceOpeningHours,
    min_period: '01:30:00',
  });
  const getWrapper = props => shallowWithIntl(<TimePickerCalendar {...defaultProps} {...props} />);
  const wrapper = getWrapper({ resource: userResource, date: '2019-12-17' });

  test('bounces to valid avalilable slot if selection is not valid', () => {
    // The valid slot is from 16:30 - 18:00 if user's selected slot starts from 17:00
    const instance = wrapper.instance();
    const bouncedSlot = instance.getSelectableTimeRange(selectedInvalidSlot);

    expect(bouncedSlot.start.toJSON()).toBe('2019-12-17T16:30:00.000Z');
    expect(bouncedSlot.end.toJSON()).toBe('2019-12-17T18:00:00.000Z');
  });

  test('fills entire opening hours if resource should be reserved for whole day', () => {
    const wholeDayResourceOpeningHours = [{
      date: '2019-12-17',
      opens: '2019-12-17T09:00:00.000Z',
      closes: '2019-12-17T17:00:00.000Z',
    }];
    const wholeDayResource = resource.build({
      should_be_reserved_whole_day: true,
      min_period: '04:30:00',
      opening_hours: wholeDayResourceOpeningHours,
    });
    const wholeDayResourceWrapper = getWrapper({ resource: wholeDayResource, date: '2019-12-17' });
    const instance = wholeDayResourceWrapper.instance();
    const wholeDayReservationHours = instance.getSelectableTimeRange(selectedInvalidSlot);

    expect(wholeDayReservationHours.start.toJSON()).toBe(wholeDayResourceOpeningHours[0].opens);
    expect(wholeDayReservationHours.end.toJSON()).toBe(wholeDayResourceOpeningHours[0].closes);
  });
});


describe('TimePickerCalendar', () => {
  globalDateMock();

  const defaultProps = {
    resource: resource.build(),
    date: '2019-08-15',
    isStaff: false,
    onDateChange: jest.fn(),
    onReserve: jest.fn(),
    onTimeChange: jest.fn(),
  };

  const selected = {
    start: '2019-09-05T10:30:00+03:00',
    end: '2019-09-05T12:00:00+03:00',
  };


  const getWrapper = props => shallowWithIntl(<TimePickerCalendar {...defaultProps} {...props} />);

  describe('FullCalendar', () => {
    test('render normally', () => {
      const wrapper = getWrapper();

      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('edittingReservation', () => {
    const defaultSelected = {
      begin: '2019-09-05T10:30:00+03:00',
      end: '2019-09-05T12:00:00+03:00',
    };

    const edittingReservation = reservation.build(defaultSelected);

    const wrapper = getWrapper({ edittingReservation });

    test('will have selected state intitialize from edittingReservation props', () => {
      expect(wrapper.state('selected')).toEqual(selected);
    });

    test('will populate new reservation event with timeslot selected from edittingReservation', () => {
      const events = wrapper.instance().getEvents();
      expect(events[0].classNames[1]).toContain('newReservation');
    });

    test('will render edittingReservation slot when cancel current selected slot', () => {
      wrapper.setState({
        selected: {
          start: '2019-09-05T13:30:00+03:00',
          end: '2019-09-05T14:00:00+03:00',
        },
      });

      // select random time range
      const instance = wrapper.instance();

      // override calendar context with mock
      instance.calendarRef = {
        current: {
          getApi: () => ({
            unselect: jest.fn(),
          }),
        },
      };

      wrapper.update();

      // Mock on clicking cancel button
      instance.onCancel();

      // Return data match default from reservation
      expect(wrapper.state('selected')).toEqual(selected);
    });
  });
});
