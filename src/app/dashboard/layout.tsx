'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/app/icon';
import {
  LayoutGrid,
  Folder,
  Users,
  Settings,
  ChevronRight,
  User,
  LogOut,
  CalendarDays,
  Bell,
  Bot,
  AreaChart,
  Loader2,
  Briefcase,
  CheckSquare,
  Info,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { GroupProvider } from '@/components/group-provider';
import { auth } from '@/lib/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/projects', label: 'Projects', icon: Briefcase },
  { href: '/dashboard/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/documents', label: 'Documents', icon: Folder },
  { href: '/dashboard/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/dashboard/analytics', label: 'Analytics', icon: AreaChart },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { href: '/dashboard/ai-assistant', label: 'AI Assistant', icon: Bot },
];

function MainSidebar() {
  const pathname = usePathname();
  const { userProfile } = useAuth();

  const isActive = (href: string) => {
    return href !== '#' && (href === '/dashboard' ? pathname === href : pathname.startsWith(href));
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <Sidebar side="left" collapsible="icon" className="border-r">
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
          <AppIcon className="w-7 h-7 text-primary" />
          <span className="font-semibold tracking-tight text-lg">OLTECH AI</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.label}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton>
                <Avatar className="h-7 w-7">
                  <AvatarImage src={userProfile?.photoURL ?? undefined} alt={userProfile?.displayName ?? ''} />
                  <AvatarFallback>{userProfile?.displayName?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{userProfile?.displayName}</span>
                <ChevronRight className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start" className="w-56">
            <DropdownMenuLabel>{userProfile?.email}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/about">
                <Info className="mr-2 h-4 w-4" />
                <span>About</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, userProfile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  React.useEffect(() => {
    if (!loading && user && !userProfile?.groupId && !pathname.startsWith('/dashboard/join-or-create-group')) {
        router.push('/dashboard/join-or-create-group');
    }
  }, [user, userProfile, loading, router, pathname]);
  
  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is logged in but has no group, show the join/create page or redirect.
  if (!userProfile?.groupId) {
    if (pathname.startsWith('/dashboard/join-or-create-group')) {
        return <>{children}</>;
    }
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <SidebarProvider>
      <GroupProvider userProfile={userProfile}>
        <div className="flex min-h-screen">
          <MainSidebar />
          <SidebarInset className="bg-secondary/30 dark:bg-background">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
              <SidebarTrigger className="md:hidden" />
              {/* This button could be context-aware later */}
            </header>
            {children}
          </SidebarInset>
        </div>
      </GroupProvider>
    </SidebarProvider>
  );
}
