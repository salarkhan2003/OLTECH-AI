'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { AppIcon } from '@/app/icon';
import {
  LayoutGrid,
  ClipboardList,
  GanttChart,
  Folder,
  FileText,
  Users,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { href: '/dashboard/projects', label: 'Projects', icon: GanttChart },
  { href: '/dashboard/tasks', label: 'Tasks', icon: ClipboardList },
  { href: '/dashboard/documents', label: 'Documents', icon: Folder },
  { href: '/dashboard/reports', label: 'Reports', icon: FileText },
  { href: '/dashboard/team', label: 'Team', icon: Users },
];

function MainSidebar() {
  const pathname = usePathname();
  const { state, setOpen } = useSidebar();

  const isActive = (href: string) => {
    return href === '/dashboard' ? pathname === href : pathname.startsWith(href);
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
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(item.href)}
                tooltip={{ children: item.label }}
              >
                <Link href={item.href} onClick={() => state === 'expanded' && setOpen(false)}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: 'Settings' }}>
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Avatar className="h-7 w-7">
                <AvatarImage src="https://placehold.co/40x40.png" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span>User Profile</span>
              <ChevronRight className="ml-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <MainSidebar />
        <SidebarInset className="bg-secondary/30 dark:bg-background">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <Button>+ New Task</Button>
          </header>
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
