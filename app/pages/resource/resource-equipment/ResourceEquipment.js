import React from 'react';
import PropTypes from 'prop-types';
import { sortBy } from 'lodash';

import injectT from '../../../i18n/injectT';
import ResourcePanel from '../resource-info/ResourcePanel';

function ResourceEquipment({
  equipment = [],
  t,
}) {
  const equipmentColumns = sortBy(equipment, 'name').map(
    item => <div key={item.id}>{item.name}</div>,
  );
  return (
    <ResourcePanel header={t('ResourceEquipment.headingText')}>
      <div className="equipmentRow">
        { equipmentColumns }
      </div>
    </ResourcePanel>
  );
}

ResourceEquipment.propTypes = {
  equipment: PropTypes.array.isRequired,
  t: PropTypes.func.isRequired,
};

export default injectT(ResourceEquipment);
