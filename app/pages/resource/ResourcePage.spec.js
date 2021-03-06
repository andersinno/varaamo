import { expect } from 'chai';
import React from 'react';
import Immutable from 'seamless-immutable';
import simple from 'simple-mock';

import PageWrapper from 'pages/PageWrapper';
import Resource from 'utils/fixtures/Resource';
import Unit from 'utils/fixtures/Unit';
import { shallowWithIntl } from 'utils/testUtils';
import { UnconnectedResourcePage as ResourcePage } from './ResourcePage';
import ReservationInfo from './reservation-info';
import ResourceInfo from './resource-info';

describe('pages/resource/ResourcePage', () => {
  const unit = Unit.build();
  const resource = Resource.build({ unit: Unit.id });
  const defaultProps = {
    actions: { fetchResource: () => null },
    date: '2015-10-10',
    id: resource.id,
    isAdmin: false,
    isFetchingResource: false,
    isLoggedIn: true,
    location: { query: {} },
    params: {},
    resource: Immutable(resource),
    unit: Immutable(unit),
  };

  function getWrapper(props) {
    return shallowWithIntl(<ResourcePage {...defaultProps} {...props} />);
  }

  describe('render', () => {
    it('renders PageWrapper with correct props', () => {
      const pageWrapper = getWrapper().find(PageWrapper);
      expect(pageWrapper).to.have.length(1);
      expect(pageWrapper.prop('className')).to.equal('resource-page');
      expect(pageWrapper.prop('title')).to.equal(defaultProps.resource.name);
    });

    it('renders ResourceInfo with correct props', () => {
      const resourceInfo = getWrapper().find(ResourceInfo);
      expect(resourceInfo).to.have.length(1);
      expect(resourceInfo.prop('resource')).to.deep.equal(defaultProps.resource);
      expect(resourceInfo.prop('unit')).to.deep.equal(defaultProps.unit);
    });

    it('renders ReservationInfo with correct props', () => {
      const reservationInfo = getWrapper().find(ReservationInfo);
      expect(reservationInfo).to.have.length(1);
      expect(reservationInfo.prop('isLoggedIn')).to.equal(defaultProps.isLoggedIn);
      expect(reservationInfo.prop('resource')).to.deep.equal(defaultProps.resource);
    });
  });

  describe('componentDidMount', () => {
    it('calls fetchResource', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper().instance();
      instance.fetchResource = fetchResource;
      instance.componentDidMount();

      expect(fetchResource.callCount).to.equal(1);
      expect(fetchResource.lastCall.args).to.deep.equal([]);
    });
  });

  describe('componentWillUpdate', () => {
    describe('if date changed', () => {
      const nextProps = { date: '2016-12-12', isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resource data with new date', () => {
        const actualArgs = fetchResource.lastCall.args;

        expect(fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(nextProps.date);
      });
    });

    describe('if date did not change', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resource data', () => {
        expect(fetchResource.callCount).to.equal(0);
      });
    });

    describe('if isLoggedIn changed', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: !defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper().instance();
        instance.fetchResource = fetchResource;
        instance.componentWillUpdate(nextProps);
      });

      it('fetches resource data correct date', () => {
        const actualArgs = fetchResource.lastCall.args;

        expect(fetchResource.callCount).to.equal(1);
        expect(actualArgs[0]).to.equal(nextProps.date);
      });
    });

    describe('if isLoggedIn did not change', () => {
      const nextProps = { date: defaultProps.date, isLoggedIn: defaultProps.isLoggedIn };
      const fetchResource = simple.mock();

      before(() => {
        const instance = getWrapper({ actions: { fetchResource } }).instance();
        instance.componentWillUpdate(nextProps);
      });

      it('does not fetch resource data', () => {
        expect(fetchResource.callCount).to.equal(0);
      });
    });
  });
  describe('fetchResource', () => {
    it('fetches resource with correct arguments', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper({ actions: { fetchResource } }).instance();
      instance.fetchResource();
      const actualArgs = fetchResource.lastCall.args;

      expect(fetchResource.callCount).to.equal(1);
      expect(actualArgs[0]).to.equal(defaultProps.id);
      expect(actualArgs[1].start).to.contain('2015-08-01');
      expect(actualArgs[1].end).to.contain('2015-12-31');
    });
    it('fetches resource with correct arguments with a passed date', () => {
      const fetchResource = simple.mock();
      const instance = getWrapper({ actions: { fetchResource } }).instance();
      instance.fetchResource('2015-11-11');
      const actualArgs = fetchResource.lastCall.args;

      expect(fetchResource.callCount).to.equal(1);
      expect(actualArgs[0]).to.equal(defaultProps.id);
      expect(actualArgs[1].start).to.contain('2015-09-01');
      expect(actualArgs[1].end).to.contain('2016-01-31');
    });
  });
});
