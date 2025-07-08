'use client';

import * as React from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { createUserProfile, getUserProfile, joinGroup } from '@/lib/db';
import type { UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loadingUser, setLoadingUser] = React.useState(true);
  const { toast } = useToast();
  
  const userProfileRef = user ? doc(db, 'users', user.uid) : null;
  const [userProfileData, loadingProfile, errorProfile] = useDocumentData(userProfileRef);

  React.useEffect(() => {
    // This effect handles auto-joining a group after login if an invite was clicked.
    if (!loadingProfile && userProfileData && !userProfileData.groupId) {
      const joinCode = localStorage.getItem('pendingJoinCode');
      if (joinCode) {
        joinGroup(joinCode, userProfileData as UserProfile)
          .then(() => {
            toast({
              title: "Welcome to the Team!",
              description: "You've been successfully added to the group.",
            });
          })
          .catch(error => {
            console.error("Failed to auto-join group:", error);
            toast({
              variant: 'destructive',
              title: "Failed to Join",
              description: error.message || "Could not join the group. The code may be invalid."
            });
          })
          .finally(() => {
            localStorage.removeItem('pendingJoinCode');
          });
      }
    }
  }, [userProfileData, loadingProfile, toast]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Ensure user profile exists
        let profile = await getUserProfile(firebaseUser.uid);
        if (!profile) {
          profile = await createUserProfile(firebaseUser);
        }
        setUser(firebaseUser);
      } else {
        setUser(null);
      }
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    userProfile: userProfileData as UserProfile | null,
    loading: loadingUser || (user && loadingProfile),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
