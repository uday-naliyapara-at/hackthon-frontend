import { render, screen } from '@testing-library/react';

import { SocialIcon } from '.';

describe('SocialIcon', () => {
  const providers = ['apple', 'google', 'meta'] as const;

  it.each(providers)('renders %s icon', (provider) => {
    render(<SocialIcon provider={provider} data-testid="social-icon" />);
    const svg = screen.getByTestId('social-icon');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('role', 'presentation');
  });

  it('applies custom className', () => {
    render(<SocialIcon provider="apple" className="custom-class" data-testid="social-icon" />);
    const svg = screen.getByTestId('social-icon');
    expect(svg).toHaveClass('custom-class');
  });

  it('forwards additional SVG props', () => {
    render(<SocialIcon provider="apple" data-testid="social-icon" aria-label="Apple" />);
    const svg = screen.getByTestId('social-icon');
    expect(svg).toHaveAttribute('aria-label', 'Apple');
  });

  it('has correct default size classes', () => {
    render(<SocialIcon provider="apple" data-testid="social-icon" />);
    const svg = screen.getByTestId('social-icon');
    expect(svg).toHaveClass('h-5', 'w-5');
  });
});
