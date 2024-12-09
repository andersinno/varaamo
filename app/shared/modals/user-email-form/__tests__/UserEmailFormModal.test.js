import React from 'react';
import { act } from 'react-dom/test-utils';
import Button from 'react-bootstrap/lib/Button';
import Modal from 'react-bootstrap/lib/Modal';

import client from '../../../../../src/common/api/client';
import { mountWithIntl } from '../../../../utils/testUtils';
import UserEmailFormModal from '../UserEmailFormModal';

jest.mock('../../../../../src/common/api/client', () => ({
  post: jest.fn(() => Promise.resolve()),
}));

describe('UserEmailFormModal', () => {
  const defaultProps = {
    userId: '123',
    show: true,
  };

  const setup = (props = {}) => {
    const setupProps = { ...defaultProps, ...props };
    return mountWithIntl(<UserEmailFormModal {...setupProps} />);
  };

  it('renders the component', () => {
    const wrapper = setup();
    const modalTitle = wrapper.find(Modal.Title);
    const confirmButton = wrapper.find(Button);

    expect(wrapper.find('Modal').exists()).toBe(true);
    expect(modalTitle.prop('children')).toBe('UserEmailForm.title');
    expect(wrapper.find('p').at(0).text()).toBe('UserEmailForm.text');
    expect(wrapper.find('p').at(1).text()).toBe('UserEmailForm.text2');
    expect(confirmButton.length).toBe(2);
  });

  it('submits the form successfully', async () => {
    const wrapper = setup();
    const emailInput = wrapper.find('FormControl[name="email"]').first();
    const confirmEmailInput = wrapper.find('FormControl[name="confirmEmail"]').first();

    // Set the values and trigger onChange handlers
    act(() => {
      emailInput.props().onChange({ target: { name: 'email', value: 'test@example.com' } });
      confirmEmailInput.props().onChange({ target: { name: 'confirmEmail', value: 'test@example.com' } });
    });

    // Ensure component re-renders after state update
    wrapper.update();

    expect(wrapper.find('FormControl[name="email"]').prop('value')).toBe('test@example.com');
    expect(wrapper.find('FormControl[name="confirmEmail"]').prop('value')).toBe('test@example.com');

    // Simulate form submission and assert the API call
    wrapper.find('Form').simulate('submit', { preventDefault: () => {} });
    expect(client.post).toHaveBeenCalledWith('user/123/set_email', { email: 'test@example.com' });
  });

  it('handles email mismatch error', () => {
    const wrapper = setup();

    // Set the values and trigger onChange handlers
    act(() => {
      wrapper.find('FormControl[name="email"]').simulate('change', { target: { name: 'email', value: 'test@example.com' } });
      wrapper.find('FormControl[name="confirmEmail"]').simulate('change', { target: { name: 'confirmEmail', value: 'mismatch@example.com' } });
    });

    // Ensure component re-renders after state update
    wrapper.update();

    expect(wrapper.find('FormControl[name="email"]').prop('value')).toBe('test@example.com');
    expect(wrapper.find('FormControl[name="confirmEmail"]').prop('value')).toBe('mismatch@example.com');

    // Simulate form submission and assert the API call
    wrapper.find('Form').simulate('submit', { preventDefault: () => {} });
    expect(wrapper.find('.emailMismatchErrorMessage').exists()).toBe(true);
  });
});
