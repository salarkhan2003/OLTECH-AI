'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AppIcon } from '@/app/icon';
import { ArrowRight, Bot, FolderSync, GanttChartSquare } from 'lucide-react';
import { useAuth } from '@/components/auth-provider';

export default function LandingPage() {
  const { user, loading } = useAuth();
  const getStartedLink = user ? '/dashboard' : '/login';

  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppIcon className="w-8 h-8 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">OLTECH AI: Streamline</h1>
        </div>
        <Button asChild>
          <Link href={getStartedLink}>Get Started</Link>
        </Button>
      </header>
      <main className="flex-1">
        <section className="relative py-20 md:py-32 bg-background">
          <div
            className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[10px_10px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:bg-grid-slate-400/[0.05] dark:bg-[10px_10px] dark:[mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <h2 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 pb-4">
              Unify Your Workflow. Amplify Your Impact.
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              OLTECH AI: Streamline is the all-in-one platform that brings your projects, tasks, and team together. Powered by AI, built for startups.
            </p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={getStartedLink}>
                Go to Dashboard <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="py-20 md:py-24 bg-secondary/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold">Features Built for High-Performance Teams</h3>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Everything you need to manage projects, track progress, and collaborate effectively.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <GanttChartSquare className="w-6 h-6" />
                  </div>
                  <CardTitle>Project & Task Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From simple to-do lists to complex projects with Gantt charts, keep everything organized and on track.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <FolderSync className="w-6 h-6" />
                  </div>
                  <CardTitle>Intelligent Document Hub</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Upload, categorize, and manage all your project files. Let our AI summarize long documents for you in seconds.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Bot className="w-6 h-6" />
                  </div>
                  <CardTitle>AI-Powered Automation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Generate status reports, get progress summaries, and receive smart alerts to stay ahead of deadlines.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} OLTECH AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
