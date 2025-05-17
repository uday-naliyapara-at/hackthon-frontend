import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormField } from '.';

describe('FormField', () => {
  it('renders correctly with label and input', () => {
    render(<FormField id="test" label="Test Field" placeholder="Enter test" />);

    expect(screen.getByText('Test Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter test')).toBeInTheDocument();
  });

  it('shows error state with error message', () => {
    render(
      <FormField id="test" label="Test Field" error={true} errorMessage="This field is required" />
    );

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Field');
    const errorMessage = screen.getByText('This field is required');

    expect(input).toHaveClass('border-red-500');
    expect(label).toHaveClass('text-red-500');
    expect(errorMessage).toHaveClass('text-red-500');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'test-error');
  });

  it('shows required state', () => {
    render(<FormField id="test" label="Test Field" required />);

    const input = screen.getByRole('textbox');
    const requiredIndicator = screen.getByText('*');

    expect(input).toHaveAttribute('required');
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('passes through additional input props', () => {
    render(
      <FormField
        id="test"
        label="Test Field"
        type="email"
        placeholder="Enter email"
        className="custom-class"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    const inputClasses = input.className.split(' ');
    expect(inputClasses).toContain('custom-class');
  });

  it('maintains proper label-input association', () => {
    render(<FormField id="test" label="Test Field" />);

    const input = screen.getByRole('textbox');
    const label = screen.getByText('Test Field');

    expect(input).toHaveAttribute('id', 'test');
    expect(label).toHaveAttribute('for', 'test');
  });
});
