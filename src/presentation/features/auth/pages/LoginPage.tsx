import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { Card, CardContent } from '@/presentation/shared/atoms/Card';
import { LoginForm } from '../organisms/LoginForm';

export const LoginPage = () => {

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-lg font-semibold">KudosWall</span>
      </div>
      <Card className="mx-auto w-full max-w-[400px] overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-1">
          <AuthProvider>
            <div className="p-6 md:p-8">
              <LoginForm
                signUpUrl="/auth/signup"
                // forgotPasswordUrl="/auth/forgot-password"
              />
            </div>
          </AuthProvider>
        </CardContent>
      </Card>
    </div>
    
  );
};
