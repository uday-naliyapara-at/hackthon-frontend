import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { Card, CardContent } from '@/presentation/shared/atoms/Card';
import HeroBackground from '@/assets/Heroback.png';
import { LoginForm } from '../organisms/LoginForm';

export const LoginPage = () => {

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center bg-muted/50 p-4"
      style={{
        backgroundImage: `url(${HeroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="mb-2 flex items-center gap-2">
      </div>
      <Card className="mx-auto w-full max-w-[500px] overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-1">
          <AuthProvider>
            <div className="p-6 md:p-8">
              <LoginForm
                signUpUrl="/auth/signup"
                redirectTo="/home"
                // forgotPasswordUrl="/auth/forgot-password"
              />
            </div>
          </AuthProvider>
        </CardContent>
      </Card>
    </div>
    
  );
};
