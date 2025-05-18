import { useAuth } from '@/presentation/features/auth/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { UserAvatar } from '@/presentation/shared/atoms/UserAvatar';

export function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-8" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <UserAvatar user={user} size="lg" className="border-4 border-blue-500" />
          <div className="flex-1">
            <h2 className="text-2xl font-semibold mb-2">{user.fullName}</h2>
            <p className="text-gray-600 mb-4">{user.email}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Role</h3>
                <p className="mt-1 text-gray-900">{user.role}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Team ID</h3>
                <p className="mt-1 text-gray-900">{user.teamId || 'No team assigned'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Email Verified</h3>
                <p className="mt-1 text-gray-900">{user.emailVerified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Name</h3>
                <p className="mt-1 text-gray-900">{user.firstName} {user.lastName}</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 