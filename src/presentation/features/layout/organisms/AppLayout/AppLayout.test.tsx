import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { AuthContext } from '@/presentation/features/auth/context/AuthContext';
import { NAV_SECTIONS, ORGANIZATION } from '@/presentation/features/layout/constants/navigation';
import { AppLayout } from '@/presentation/features/layout/organisms/AppLayout';

// Mock useAuth hook
vi.mock('@/presentation/features/auth/hooks', () => ({
  useAuth: vi.fn().mockReturnValue({
    isLoading: false,
    user: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      emailVerified: true,
      avatarUrl: 'https://github.com/shadcn.png',
      role: 'Admin',
      status: 'Active' as const,
    },
  }),
  useLogout: vi.fn().mockReturnValue({ logout: vi.fn() }),
}));

/**
 * Test suite for AppLayout component
 * Tests responsive behavior, sidebar states, and navigation rendering
 */

// Configure longer timeout for async tests
vi.setConfig({ testTimeout: 10000 });

// #region Test Constants
const TEST_CONTENT = 'Test content';
// #endregion

// #region Test Utils
/**
 * Sets viewport width and triggers resize event
 */
const setViewport = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

/**
 * Verifies presence of all navigation items in container
 */
const verifyNavItems = (container: HTMLElement) => {
  // Check organization info
  expect(within(container).getByText(ORGANIZATION.name)).toBeInTheDocument();
  expect(within(container).getByText(ORGANIZATION.type)).toBeInTheDocument();

  // Check platform section
  expect(within(container).getByText(NAV_SECTIONS.platform.title)).toBeInTheDocument();
  NAV_SECTIONS.platform.items.forEach((item) => {
    expect(within(container).getByText(item.name)).toBeInTheDocument();
  });

  // Check developer docs section
  expect(within(container).getByText(NAV_SECTIONS.developerDocs.title)).toBeInTheDocument();
  NAV_SECTIONS.developerDocs.items.forEach((item) => {
    expect(within(container).getByText(item.name)).toBeInTheDocument();
  });
};

// Mock auth services
const mockAuthService = {
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
  forgotPassword: vi.fn(),
  resetPassword: vi.fn(),
  getCurrentUser: vi.fn(),
};

const mockSessionService = {
  initializeSession: vi.fn(),
  clearSession: vi.fn(),
  getAccessToken: vi.fn(),
  refreshAccessToken: vi.fn().mockResolvedValue('mock_access_token'),
  validateSession: vi.fn(),
  getRefreshToken: vi.fn(),
  storeTokens: vi.fn(),
  checkAuthStatus: vi.fn(),
};

const mockEmailVerificationService = {
  verifyEmail: vi.fn(),
  resendVerification: vi.fn(),
  getVerificationStatus: vi.fn(),
  canResendVerification: vi.fn(),
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <AuthContext.Provider
        value={{
          authService: mockAuthService,
          sessionService: mockSessionService,
          emailVerificationService: mockEmailVerificationService,
        }}
      >
        <MemoryRouter>
          <Routes>
            <Route element={ui}>
              <Route path="/" element={<div>{TEST_CONTENT}</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    </ThemeProvider>
  );
};
// #endregion

describe('AppLayout', () => {
  // Set default viewport for all tests
  beforeEach(() => {
    setViewport(1024); // Desktop by default
    vi.clearAllMocks();
  });

  // #region Basic Rendering Tests
  test('renders layout with sidebar and main content', () => {
    // Render layout
    renderWithProviders(<AppLayout />);

    // Verify basic structure
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
    verifyNavItems(screen.getByRole('complementary'));
  });

  test('maintains responsive behavior', async () => {
    // Render layout
    renderWithProviders(<AppLayout />);

    // Verify desktop view
    expect(screen.getByRole('complementary')).toBeInTheDocument();
    const toggleContainer = screen.getByTestId('sidebar-toggle').closest('div');
    expect(toggleContainer).toHaveClass('md:hidden');

    // Switch to mobile view and verify
    setViewport(375);
    await waitFor(() => {
      expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
      expect(screen.getByRole('complementary')).toHaveClass('hidden');
    });
  });
  // #endregion

  // #region Mobile Tests
  describe('Mobile Sidebar', () => {
    beforeEach(() => {
      setViewport(375);
    });

    test('handles mobile sidebar interactions correctly', async () => {
      // Render layout
      renderWithProviders(<AppLayout />);
      const toggleButton = screen.getByTestId('sidebar-toggle');

      // Open sidebar
      fireEvent.click(toggleButton);

      // Verify dialog and content
      const dialog = await screen.findByRole('dialog');
      expect(dialog).toHaveAttribute('aria-labelledby');
      expect(dialog).toHaveAttribute('aria-describedby');

      // Verify navigation items
      const sheetContent = within(dialog).getByRole('navigation');
      verifyNavItems(sheetContent);

      // Close sidebar and verify
      const overlay = document.querySelector('[data-radix-sheet-overlay]');
      if (overlay) {
        fireEvent.click(overlay);
        await waitFor(() => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
          expect(document.activeElement).toBe(toggleButton);
        });
      }
    });

    test.skip('handles logout in mobile view', async () => {
      renderWithProviders(<AppLayout />);
      const toggleButton = screen.getByTestId('sidebar-toggle');

      // Open sidebar
      fireEvent.click(toggleButton);

      // Find and click logout button
      const logoutButton = await screen.findByTestId('user-nav-logout');
      fireEvent.click(logoutButton);

      // Verify logout was called
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
  // #endregion

  // #region Desktop Tests
  describe('Desktop Sidebar', () => {
    beforeEach(() => {
      setViewport(1024);
    });

    test('renders in expanded state by default', () => {
      // Render layout
      renderWithProviders(<AppLayout />);
      const sidebar = screen.getByRole('complementary');

      // Verify expanded state
      expect(sidebar).not.toHaveClass('w-16');
      expect(sidebar).toHaveClass('w-64');
      expect(screen.getByText(ORGANIZATION.name)).toBeVisible();
    });

    test('collapses to icon-only view when toggled', () => {
      // Render layout
      renderWithProviders(<AppLayout />);
      const sidebar = screen.getByRole('complementary');

      // Toggle sidebar
      fireEvent.click(screen.getByTestId('desktop-sidebar-toggle'));

      // Verify collapsed state
      expect(sidebar).toHaveClass('w-16');
      expect(sidebar).not.toHaveClass('w-64');
      expect(screen.queryByText(ORGANIZATION.name)).not.toBeInTheDocument();

      // Verify icons visibility
      NAV_SECTIONS.platform.items.forEach((item) => {
        expect(screen.getByTestId(`${item['data-testid']}-icon`)).toBeVisible();
      });
    });

    test('preserves navigation item icons in collapsed state', () => {
      // Render layout
      renderWithProviders(<AppLayout />);

      // Toggle to collapsed state
      fireEvent.click(screen.getByTestId('desktop-sidebar-toggle'));

      // Verify platform icons
      NAV_SECTIONS.platform.items.forEach((item) => {
        expect(screen.getByTestId(`${item['data-testid']}-icon`)).toBeVisible();
      });

      // Verify developer docs icons
      NAV_SECTIONS.developerDocs.items.forEach((item) => {
        expect(screen.getByTestId(`${item['data-testid']}-icon`)).toBeVisible();
      });
    });

    test('maintains collapsed state on window resize', async () => {
      // Render layout
      renderWithProviders(<AppLayout />);
      const sidebar = screen.getByRole('complementary');

      // Collapse sidebar
      fireEvent.click(screen.getByTestId('desktop-sidebar-toggle'));
      expect(sidebar).toHaveClass('w-16');

      // Resize and verify state persistence
      setViewport(1440);
      await waitFor(() => {
        expect(sidebar).toHaveClass('w-16');
        expect(sidebar).not.toHaveClass('w-64');
      });
    });

    test.skip('handles logout in desktop view', async () => {
      renderWithProviders(<AppLayout />);

      // Find and click logout button
      const logoutButton = screen.getByTestId('user-nav-logout');
      fireEvent.click(logoutButton);

      // Verify logout was called
      expect(mockAuthService.logout).toHaveBeenCalled();
    });
  });
  // #endregion

  it('should render the layout with navigation and content', () => {
    renderWithProviders(<AppLayout />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText(TEST_CONTENT)).toBeInTheDocument();
  });

  it('should render mobile navigation for small screens', () => {
    renderWithProviders(<AppLayout />);
    expect(screen.getByTestId('sidebar-toggle')).toBeInTheDocument();
  });
});
