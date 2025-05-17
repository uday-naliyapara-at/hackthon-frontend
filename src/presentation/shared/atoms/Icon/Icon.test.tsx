import { render, screen } from '@testing-library/react';

import { createRef } from 'react';
import { HiCog, HiHome } from 'react-icons/hi';

import { Icon } from '../';

/**
 * Test suite for Icon component
 * Tests rendering, prop handling, styling, and ref forwarding
 */
describe('Icon Component', () => {
  // #region Rendering Tests
  describe('Rendering', () => {
    it('should render the provided icon', () => {
      // Render component
      render(<Icon data-testid="test-icon" icon={HiHome} />);
      const wrapper = screen.getByTestId('test-icon-wrapper');
      const icon = screen.getByTestId('test-icon');

      // Verify basic rendering
      expect(wrapper).toBeInTheDocument();
      expect(wrapper.tagName.toLowerCase()).toBe('span');
      expect(icon).toBeInTheDocument();
      expect(icon.tagName.toLowerCase()).toBe('svg');
    });

    it('should forward ref to underlying span element', () => {
      // Setup ref
      const ref = createRef<HTMLSpanElement>();

      // Render with ref
      render(<Icon ref={ref} data-testid="test-icon" icon={HiHome} />);

      // Verify ref forwarding
      expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    });

    it('should render different icons based on icon prop', () => {
      // Initial render with Home icon
      const { rerender } = render(<Icon data-testid="test-icon" icon={HiHome} />);
      let icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();

      // Re-render with Settings icon
      rerender(<Icon data-testid="test-icon" icon={HiCog} />);
      icon = screen.getByTestId('test-icon');
      expect(icon).toBeInTheDocument();
    });
  });
  // #endregion

  // #region Styling Tests
  describe('Styling', () => {
    it('should apply size prop correctly', () => {
      // Render with size prop
      render(<Icon data-testid="test-icon" icon={HiHome} size={24} />);
      const icon = screen.getByTestId('test-icon');

      // Verify size attributes
      expect(icon).toHaveAttribute('width', '24');
      expect(icon).toHaveAttribute('height', '24');
    });

    it('should apply color prop correctly', () => {
      // Render with color prop
      render(<Icon data-testid="test-icon" icon={HiHome} color="red" />);
      const icon = screen.getByTestId('test-icon');

      // Verify color attribute
      expect(icon).toHaveAttribute('color', 'red');
    });

    it('should apply className prop correctly', () => {
      // Render with className prop
      render(<Icon data-testid="test-icon" icon={HiHome} className="custom-class" />);
      const icon = screen.getByTestId('test-icon');

      // Verify class attribute
      expect(icon).toHaveClass('custom-class');
    });
  });
  // #endregion

  // #region Props Tests
  describe('Props', () => {
    it('should pass through additional HTML attributes', () => {
      // Render with additional attributes
      render(
        <Icon
          data-testid="test-icon"
          icon={HiHome}
          className="custom-class"
          aria-label="Home icon"
        />
      );
      const icon = screen.getByTestId('test-icon');

      // Verify attribute forwarding
      expect(icon).toHaveClass('custom-class');
      expect(icon).toHaveAttribute('aria-label', 'Home icon');
    });
  });
  // #endregion
});
