import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import 'jest-styled-components';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn()
      };
    },
  };
});

describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name='email' placeholder='E-mail' />
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name='email' placeholder='E-mail' />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyleRule('border-color: #FF9000;');
      expect(containerElement).toHaveStyleRule('color: #FF9000;');
    });
  });

  it('should keep input border highlight when input is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name='email' placeholder='E-mail' />
    );

    const inputElement = getByPlaceholderText('E-mail');
    const containerElement = getByTestId('input-container');

    fireEvent.change(inputElement, {
      target: { value: 'johndoe@example.com' }
    })

    fireEvent.blur(inputElement);

    await waitFor(() => {
      expect(containerElement).toHaveStyleRule('color: #FF9000;');
    });
  });
});