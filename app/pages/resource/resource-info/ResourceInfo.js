import upperFirst from 'lodash/upperFirst';
import PropTypes from 'prop-types';
import React from 'react';
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';

import { injectT } from 'i18n';
import WrappedText from 'shared/wrapped-text';
import ReservationInfo from '../reservation-info';

function ResourceInfo({
  isLoggedIn, resource, unit, t
}) {
  return (
    <Row>
      <section className="app-ResourceInfo">
        <div className="app-ResourceInfo__description">
          {resource.description && <WrappedText openLinksInNewTab text={resource.description} />}
        </div>
        <Panel defaultExpanded header={t('ResourceInfo.reservationTitle')}>
          <ReservationInfo isLoggedIn={isLoggedIn} resource={resource} />
        </Panel>
        <Panel defaultExpanded header={t('ResourceInfo.additionalInfoTitle')}>
          <Row>
            <Col className="app-ResourceInfo__address" xs={6}>
              {unit && unit.name && <span>{unit.name}</span>}
              {unit && unit.streetAddress && <span>{unit.streetAddress}</span>}
              {unit && <span>{`${unit.addressZip} ${upperFirst(unit.municipality)}`.trim()}</span>}
            </Col>
          </Row>
        </Panel>
      </section>
    </Row>
  );
}

ResourceInfo.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  resource: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  unit: PropTypes.object.isRequired,
};

ResourceInfo = injectT(ResourceInfo); // eslint-disable-line

export default ResourceInfo;
