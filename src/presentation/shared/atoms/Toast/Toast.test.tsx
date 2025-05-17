import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { useToast } from '@/components/hooks/use-toast';

import { Toaster } from './index';

// Mock the useToast hook
vi.mock('@/components/hooks/use-toast', () => ({
  useToast: vi.fn(),
}));

describe('Toaster', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // #region Rendering
  it('should render toast with title and description', () => {
    const mockToast = {
      id: '1',
      title: 'Test Title',
      description: 'Test Description',
    };

    (useToast as jest.Mock).mockReturnValue({
      toasts: [mockToast],
    });

    render(<Toaster />);

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render toast with only description', () => {
    const mockToast = {
      id: '1',
      description: 'Test Description',
    };

    (useToast as jest.Mock).mockReturnValue({
      toasts: [mockToast],
    });

    render(<Toaster />);

    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render multiple toasts', () => {
    const mockToasts = [
      { id: '1', description: 'First Toast' },
      { id: '2', description: 'Second Toast' },
    ];

    (useToast as jest.Mock).mockReturnValue({
      toasts: mockToasts,
    });

    render(<Toaster />);

    expect(screen.getByText('First Toast')).toBeInTheDocument();
    expect(screen.getByText('Second Toast')).toBeInTheDocument();
  });
  // #endregion

  // #region Position Tests
  it('should apply correct position classes for top-right (default)', () => {
    (useToast as jest.Mock).mockReturnValue({ toasts: [] });

    const { container } = render(<Toaster />);
    const viewport = container.querySelector('[class*="fixed"]');

    expect(viewport).toHaveClass('top-0 right-0');
    expect(viewport).toHaveClass('flex-col-reverse');
  });

  it('should apply correct position classes for bottom-left', () => {
    (useToast as jest.Mock).mockReturnValue({ toasts: [] });

    const { container } = render(<Toaster position="bottom-left" />);
    const viewport = container.querySelector('[class*="fixed"]');

    expect(viewport).toHaveClass('bottom-0 left-0');
    expect(viewport).toHaveClass('flex-col');
  });
  // #endregion

  // #region Custom Classes
  it('should apply custom container class', () => {
    (useToast as jest.Mock).mockReturnValue({ toasts: [] });

    const { container } = render(<Toaster containerClassName="custom-class" />);
    const viewport = container.querySelector('[class*="fixed"]');

    expect(viewport).toHaveClass('custom-class');
  });
  // #endregion
});
