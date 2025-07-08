'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, Laptop, LogOut, KeyRound } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useAuth } from '@/components/auth-provider';

export default function SettingsPage() {
  const { setTheme, theme } = useTheme();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSignOut = () => {
    auth.signOut();
    router.push('/login');
  };
  
  const handlePasswordReset = async () => {
    if (!user?.email) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not find your email address.',
      });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast({
        title: 'Password Reset Email Sent',
        description: 'Check your inbox for a link to reset your password.',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send password reset email.',
      });
    }
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and app preferences.</p>
      </div>
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant={theme === 'light' ? 'default' : 'outline'} onClick={() => setTheme('light')}>
                <Sun className="mr-2" /> Light
              </Button>
              <Button variant={theme === 'dark' ? 'default' : 'outline'} onClick={() => setTheme('dark')}>
                <Moon className="mr-2" /> Dark
              </Button>
              <Button variant={theme === 'system' ? 'default' : 'outline'} onClick={() => setTheme('system')}>
                <Laptop className="mr-2" /> System
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account settings and security.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                    <h3 className="font-medium">Reset Password</h3>
                    <p className="text-sm text-muted-foreground">Send a password reset link to your email.</p>
                </div>
                <Button variant="outline" onClick={handlePasswordReset}>
                    <KeyRound className="mr-2"/>
                    Send Reset Link
                </Button>
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg border-destructive/50">
                <div>
                    <h3 className="font-medium text-destructive">Sign Out</h3>
                    <p className="text-sm text-muted-foreground">End your current session.</p>
                </div>
                <Button variant="destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2"/>
                    Sign Out
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
