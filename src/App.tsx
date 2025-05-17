import { ThemeProvider } from 'next-themes';

import { BrowserRouter, useRoutes } from 'react-router-dom';

import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { routes } from '@/presentation/routes';
import { Toaster } from '@/presentation/shared/atoms/Toast';

const AppRoutes = () => {
  return useRoutes(routes);
};

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
