import React from 'react';
import toJSON from 'enzyme-to-json';

import { shallowWithIntl } from '../../../../../app/utils/testUtils';
import { UnconnectedResourceCard } from '../ResourceCard';
import unit from '../../../../common/data/fixtures/unit';
import resource from '../../../../common/data/fixtures/resource';

describe('ResourceCard', () => {
  const props = {
    date: '30-07-2019',
    key: 'foo',
    onFavoriteClick: jest.fn(),
    onFilterClick: jest.fn(),
    resource: resource.build({ authentication: 'weak' }),
    unit: unit.build(),
    access_methods: [{ id: 'pincode' }],
    t: () => {},
  };

  test('renders correctly', () => {
    const wrapper = shallowWithIntl(
      <UnconnectedResourceCard {...props} />,
    );

    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  test('user logged in', () => {
    const wrapper = shallowWithIntl(
      <UnconnectedResourceCard {...props} isLoggedIn />,
    );


    expect(toJSON(wrapper)).toMatchSnapshot();
    wrapper.find('.app-resourceCard2__favorite-button').simulate('click', {
      preventDefault: jest.fn(),
      stopPropagation: jest.fn(),
    });
    expect(props.onFavoriteClick).toBeCalled();
  });
});
