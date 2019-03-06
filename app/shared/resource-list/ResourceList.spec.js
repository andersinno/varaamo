import { expect } from 'chai';
import { shallow } from 'enzyme';
import React from 'react';
import Immutable from 'seamless-immutable';

import ResourceCard from 'shared/resource-card';
import ResourceList from './ResourceList';

describe('shared/resource-list/ResourceList', () => {
  const defaultProps = {
    emptyMessage: 'Some empty message',
    history: {},
    location: {
      state: {
        scrollTop: 123,
      },
    },
    resourceIds: Immutable(['resource-1', 'resource-2']),
    date: '2017-01-01',
  };

  function getWrapper(extraProps) {
    return shallow(<ResourceList {...defaultProps} {...extraProps} />);
  }

  describe('with resourceIds', () => {
    let wrapper;

    beforeAll(() => {
      wrapper = getWrapper();
    });

    test('renders a div', () => {
      expect(wrapper.is('div')).to.be.true;
    });

    test('does not render the empty message', () => {
      const emptyMessage = wrapper.find('p');
      expect(emptyMessage.length).to.equal(0);
    });

    describe('rendering individual ResourceCards', () => {
      let resourceCards;

      beforeAll(() => {
        resourceCards = wrapper.find(ResourceCard);
      });

      test('renders a ResourceCard for every resource in props', () => {
        expect(resourceCards.length).to.equal(defaultProps.resourceIds.length);
      });

      test('passes correct props to ResourceCard', () => {
        resourceCards.forEach((resourceListItem, index) => {
          expect(resourceListItem.props().resourceId).to.equal(defaultProps.resourceIds[index]);
          expect(resourceListItem.props().date).to.equal(defaultProps.date);
        });
      });
    });
  });

  describe('without resourceIds', () => {
    const resourceIds = [];

    test('does not render a list', () => {
      const list = getWrapper({ resourceIds }).find('ul');
      expect(list.length).to.equal(0);
    });

    describe('empty message', () => {
      test('renders the emptyMessage given in props', () => {
        const emptyMessage = 'Some empty message';
        const message = getWrapper({ emptyMessage, resourceIds }).find('p');
        expect(message.text()).to.equal(emptyMessage);
      });

      test('renders an empty div if no emptyMessage is given in props', () => {
        const emptyMessage = undefined;
        const wrapper = getWrapper({ emptyMessage, resourceIds });
        expect(wrapper.matchesElement(<div />)).to.be.true;
      });
    });
  });
});
