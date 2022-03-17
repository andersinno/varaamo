import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import { sortBy } from 'lodash';

import injectT from '../../../i18n/injectT';
import ResourcePanel from '../resource-info/ResourcePanel';

function ResourceEquipment({
  equipment = [],
  t,
}) {
  const equipmentColumns = sortBy(equipment, 'name').map(
    (item, i) => <Col key={i} lg={6} md={6} xs={12}>{item.name}</Col>,
  );
  return (
    <ResourcePanel header={t('ResourceEquipment.headingText')}>
      <Row>
        {equipmentColumns}
      </Row>
    </ResourcePanel>
  );
}

ResourceEquipment.propTypes = {
  equipment: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceEquipment);
