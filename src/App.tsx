import { ThemeProvider } from 'next-themes';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { TeamProvider } from '@/presentation/features/team/context/TeamContext';
import { UserManagementProvider } from '@/presentation/features/admin/context/UserManagementContext';
import { routes } from '@/presentation/routes';
import { Toaster } from '@/presentation/shared/atoms/Toast';
import { userManagementService } from '@/infrastructure/services/user-management';

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TeamProvider>
            <UserManagementProvider userManagementService={userManagementService}>
              <AppRoutes />
              <Toaster position="top-right" />
            </UserManagementProvider>
          </TeamProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
