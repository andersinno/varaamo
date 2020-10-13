import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import Toggle from 'react-toggle';

import { toggleContrast } from '../../../app/actions/uiActions';
import injectT from '../../../app/i18n/injectT';
import HeaderOption from './HeaderOption';

const CONTRAST_CONTROL_ID = 'contrast-control';

const HeaderContrastControl = ({ isHighContrast, onToggleContrast, t }) => {
  return (
    <HeaderOption
      label={<label htmlFor={CONTRAST_CONTROL_ID}>{t('HeaderContrastControl.label')}</label>}
    >
      <Toggle
        id={CONTRAST_CONTROL_ID}
        onChange={onToggleContrast}
        value={JSON.stringify(isHighContrast)}
      />
    </HeaderOption>
  );
};

HeaderContrastControl.propTypes = {
  isHighContrast: PropTypes.bool.isRequired,
  onToggleContrast: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

const isHighContrastSelector = state => state.ui.accessibility.isHighContrast;

export const selector = createStructuredSelector({
  isHighContrast: isHighContrastSelector,
});

const actions = {
  onToggleContrast: toggleContrast,
};

export default injectT(connect(selector, actions)(HeaderContrastControl));
