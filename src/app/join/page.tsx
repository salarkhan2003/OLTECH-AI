'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getGroupDetailsByJoinCode } from '@/lib/actions';
import { Loader2, Users, AlertTriangle } from 'lucide-react';
import type { Group } from '@/lib/types';

export default function JoinPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinCode = searchParams.get('code');

  const [group, setGroup] = React.useState<Group | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!joinCode) {
      setError("No join code provided in the link.");
      setLoading(false);
      return;
    }

    async function fetchGroup() {
      try {
        const groupDetails = await getGroupDetailsByJoinCode(joinCode!);
        if (groupDetails) {
          setGroup(groupDetails);
        } else {
          setError("This invite link is invalid or has expired.");
        }
      } catch (e) {
        console.error(e);
        setError("Could not verify the invite link. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchGroup();
  }, [joinCode]);
  
  const handleJoin = (path: '/login' | '/signup') => {
    if (!joinCode) return;
    localStorage.setItem('pendingJoinCode', joinCode);
    router.push(path);
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Verifying invite link...</p>
        </div>
      );
    }

    if (error || !group) {
        return (
             <div className="flex flex-col items-center justify-center p-8 text-center">
                <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
                <p className="font-semibold text-lg">Invite Not Found</p>
                <p className="text-muted-foreground">{error}</p>
                <Button asChild variant="outline" className="mt-6">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </div>
        )
    }

    return (
        <>
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full text-primary">
                        <Users className="h-8 w-8" />
                    </div>
                </div>
                <CardTitle>You're invited to join</CardTitle>
                <CardDescription className="text-xl font-bold text-foreground">{group.name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button className="w-full" size="lg" onClick={() => handleJoin('/signup')}>
                    Create Account to Join
                </Button>
                <Button variant="outline" className="w-full" onClick={() => handleJoin('/login')}>
                    Already have an account? Sign In
                </Button>
            </CardContent>
        </>
    );
  }

  return (
    <Card>
      {renderContent()}
    </Card>
  );
}
