'use client';
import { UserProfileForm } from '@/components/dashboard/user-profile-form';
import { useAuth } from '@/components/auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { userProfile, loading } = useAuth();

  if (loading || !userProfile) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={userProfile.photoURL ?? ''} alt={userProfile.displayName ?? ''} />
              <AvatarFallback className="text-3xl">
                {userProfile.displayName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{userProfile.displayName}</h1>
                <p className="text-muted-foreground">{userProfile.email}</p>
            </div>
        </div>
      </div>
      <UserProfileForm userProfile={userProfile} />
    </main>
  );
}
