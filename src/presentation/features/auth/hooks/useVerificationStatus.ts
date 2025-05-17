import { useEffect, useState } from 'react';

import { VerificationStatus } from '@/domain/models/auth';

import { useAuthContext } from '../context/AuthContext';

interface UseVerificationStatusResult {
  status: VerificationStatus;
  isLoading: boolean;
}

export const useVerificationStatus = (email?: string): UseVerificationStatusResult => {
  const [status, setStatus] = useState<VerificationStatus>({
    isVerified: false,
    canResend: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { emailVerificationService } = useAuthContext();

  useEffect(() => {
    if (!email) return;

    const updateStatus = () => {
      setIsLoading(true);
      try {
        const newStatus = emailVerificationService.getVerificationStatus(email);
        setStatus(newStatus);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial status check
    updateStatus();

    // Update status every second if in cooldown
    const interval = setInterval(() => {
      const currentStatus = emailVerificationService.getVerificationStatus(email);
      if (!currentStatus.canResend && currentStatus.cooldownEndsAt) {
        updateStatus();
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [email, emailVerificationService]);

  return {
    status,
    isLoading,
  };
};
