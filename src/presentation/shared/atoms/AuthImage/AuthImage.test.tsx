import { render, screen } from '@testing-library/react';

import { AuthImage } from '.';

describe('AuthImage', () => {
  it('renders with default props', () => {
    render(<AuthImage />);
    const img = screen.getByRole('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/placeholder.svg');
    expect(img).toHaveAttribute('alt', '');
  });

  it('renders with custom props', () => {
    const props = {
      src: '/test.jpg',
      alt: 'Test image',
      className: 'custom-class',
    };
    render(<AuthImage {...props} />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/test.jpg');
    expect(img).toHaveAttribute('alt', 'Test image');
    expect(img).toHaveClass('custom-class');
  });

  it('uses fallbackSrc when src is not provided', () => {
    render(<AuthImage fallbackSrc="/fallback.jpg" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/fallback.jpg');
  });

  it('has dark mode classes', () => {
    render(<AuthImage />);
    const img = screen.getByRole('img');
    expect(img).toHaveClass('dark:brightness-[0.2]', 'dark:grayscale');
  });

  it('container has correct responsive classes', () => {
    const { container } = render(<AuthImage />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('hidden', 'md:block');
  });
});
