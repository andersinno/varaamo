import React from 'react';

//TODO: Fix the style

class DropdownField extends React.Component {
  renderSelectOptions = item => (
    <option key={item.value} value={item.value}>{item.label}</option>
  );

  render() {
    const { input, dropdownItems, type, meta: { touched, error } } = this.props;
    const inputName = input.name;
    const selectDisabled = inputName === 'userGroup';

    return (
      <div className="">
        <select {...input} style={{ padding: '10px', width: '100%' }}>
          <option disabled={selectDisabled} value="">Select</option>
          {dropdownItems.map(this.renderSelectOptions)}
        </select>
        {touched && error && <span className="app-ReservationPage__error">{error}</span>}
      </div>
    );
  }
}

export default DropdownField;
