import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/hooks/use-toast';
import { AuthProvider } from '@/presentation/features/auth/context/AuthContext';
import { Card, CardContent } from '@/presentation/shared/atoms/Card';
import type { SocialProvider } from '@/presentation/shared/atoms/SocialIcon';
import HeroBackground from '@/assets/Heroback.png';

import { SignupForm } from '../organisms/SignupForm';

export const SignupPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSocialLogin = (provider: SocialProvider) => {
    // TODO: Implement social signup logic
    console.log('Social signup with provider:', provider);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSignupSuccess = (email: string) => {
    toast({
      title: 'Account Created',
      description: 'Please check your email to verify your account.',
      variant: 'default',
    });
    // After successful signup, redirect to login page
    navigate('/auth/login');
  };

  const handleSignupError = (error: string) => {
    toast({
      title: 'Signup Failed',
      description: error,
      variant: 'destructive',
    });
  };

  const gradientStyle = {
    background: 'linear-gradient(90deg, #3B82F6 0%, #8B5CF6 50%, #EC4899 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    backgroundSize: '200% auto',
    animation: 'gradient 3s ease infinite'
  };


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
      <div className="mb-2 flex items-center gap-2 mb-8">
      <span className="text-4xl font-bold" style={gradientStyle}>KudosWall</span>
      </div>
      <Card className="mx-auto w-full max-w-[500px] overflow-hidden bg-white/95 backdrop-blur-sm shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-1">
          <AuthProvider>
            <div className="p-6 md:p-8">
              <SignupForm
                onSocialLogin={handleSocialLogin}
                onSignupSuccess={handleSignupSuccess}
                onError={handleSignupError}
                loginUrl="/auth/login"
                termsUrl="/legal/terms"
                privacyUrl="/legal/privacy"
              />
            </div>
          </AuthProvider>
        </CardContent>
      </Card>
    </div>
  );
};
