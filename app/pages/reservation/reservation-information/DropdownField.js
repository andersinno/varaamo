import React from 'react';
import PropTypes from 'prop-types';

import injectT from '../../../i18n/injectT';


class DropdownField extends React.Component {
  static propTypes = {
    input: PropTypes.object.isRequired,
    dropdownItems: PropTypes.PropTypes.arrayOf(PropTypes.object),
    label: PropTypes.string,
    t: PropTypes.func.isRequired,
    type: PropTypes.string,
    meta: PropTypes.object.isRequired,
  };

  renderSelectOptions = item => (
    <option key={item.value} value={item.value}>{item.label}</option>
  );

  render() {
    const {
      input, dropdownItems, label, t, meta: { touched, error },
    } = this.props;
    const inputName = input.name;
    const placeholderDisabled = inputName === 'userGroup';

    return (
      <div className="app-ReservationPage__formfield">
        <label>
          {label}
          <select {...input} style={{ padding: '10px', width: '100%' }}>
            <option disabled={placeholderDisabled} value="">{t('common.select')}</option>
            {dropdownItems.map(this.renderSelectOptions)}
          </select>
        </label>
        {touched && error && <span className="app-ReservationPage__error">{error}</span>}
      </div>
    );
  }
}

export default injectT(DropdownField);
