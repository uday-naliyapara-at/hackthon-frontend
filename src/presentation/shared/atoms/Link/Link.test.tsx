import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MemoryRouter } from 'react-router-dom';

import { Link } from '.';

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: MemoryRouter });
};

describe('Link', () => {
  it('renders correctly', () => {
    renderWithRouter(<Link to="/test">Test link</Link>);
    const link = screen.getByText('Test link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('applies default variant styles', () => {
    renderWithRouter(<Link to="/test">Default link</Link>);
    const link = screen.getByText('Default link');
    expect(link).toHaveClass('text-primary');
  });

  it('applies muted variant styles', () => {
    renderWithRouter(
      <Link to="/test" variant="muted">
        Muted link
      </Link>
    );
    const link = screen.getByText('Muted link');
    expect(link).toHaveClass('text-muted-foreground');
  });

  it('applies error variant styles', () => {
    renderWithRouter(
      <Link to="/test" variant="error">
        Error link
      </Link>
    );
    const link = screen.getByText('Error link');
    expect(link).toHaveClass('text-red-500');
  });

  it('passes through additional props', () => {
    renderWithRouter(
      <Link to="/test" className="custom-class" data-testid="test-link">
        Test link
      </Link>
    );
    const link = screen.getByTestId('test-link');
    expect(link).toHaveClass('custom-class');
  });
});
