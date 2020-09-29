import { createSelector, createStructuredSelector } from 'reselect';

import FontSizes from '../../constants/FontSizes';
import ActionTypes from '../../constants/ActionTypes';
import { createIsStaffSelector, isAdminSelector, isLoggedInSelector } from '../../state/selectors/authSelectors';
import { createResourceSelector, unitsSelector } from '../../state/selectors/dataSelectors';
import dateSelector from '../../state/selectors/dateSelector';
import requestIsActiveSelectorFactory from '../../state/selectors/factories/requestIsActiveSelectorFactory';

const resourceIdSelector = (state, props) => props.match && props.match.params.id;
const resourceSelector = createResourceSelector(resourceIdSelector);
const showMapSelector = state => state.ui.resourceMap.showMap;
const unitSelector = createSelector(
  resourceSelector,
  unitsSelector,
  (resource, units) => units[resource.unit] || {},
);
const isLargeFontSizeSelector = state => state.ui.accessibility.fontSize === FontSizes.LARGE;

const resourcePageSelector = createStructuredSelector({
  date: dateSelector,
  id: resourceIdSelector,
  isAdmin: isAdminSelector,
  isFetchingResource: requestIsActiveSelectorFactory(ActionTypes.API.RESOURCE_GET_REQUEST),
  isLoggedIn: isLoggedInSelector,
  isLargeFontSize: isLargeFontSizeSelector,
  isStaff: createIsStaffSelector(resourceSelector),
  resource: resourceSelector,
  showMap: showMapSelector,
  unit: unitSelector,
});

export default resourcePageSelector;
