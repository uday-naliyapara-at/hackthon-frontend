import { BrowserRouter, useRoutes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { TeamProvider } from '@/presentation/features/team/context/TeamContext';
import { UserManagementProvider } from '@/presentation/features/admin/context/UserManagementContext';
import { routes } from '@/presentation/routes';
import { Toaster } from '@/presentation/shared/atoms/Toast';
import { userManagementService } from '@/infrastructure/services/user-management';
import { CategoriesProvider } from '@/presentation/features/categories/context/CategoriesContext';

const AppRoutes = () => {
  return useRoutes(routes);
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <TeamProvider>
              <UserManagementProvider userManagementService={userManagementService}>
                <CategoriesProvider>
                  <AppRoutes />
                  <Toaster position="top-right" />
                </CategoriesProvider>
              </UserManagementProvider>
            </TeamProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
