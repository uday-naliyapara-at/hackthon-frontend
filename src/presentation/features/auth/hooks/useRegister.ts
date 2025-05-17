import { useState } from 'react';

import type { RegisterUserDTO } from '@/domain/models/user/types';

import { useAuthContext } from '../context/AuthContext';
import type { SignupFormData } from '../types/auth.types';

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { authService } = useAuthContext();

  const register = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const registerData: RegisterUserDTO = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        teamId: data.teamId || 0
      };

      console.log("registerData*********", registerData)
      const response = await authService.register(registerData);
      console.log("response*********", response)
      return response;
    } catch (err) {
      console.log("err*********", err)
      setError(err instanceof Error ? err : new Error('Registration failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    isLoading,
    error,
  };
};
