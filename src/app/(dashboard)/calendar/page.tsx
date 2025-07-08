'use client';

import * as React from 'react';
import { useGroup } from '@/components/group-provider';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isSameDay } from 'date-fns';
import type { Task } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { DayContentProps } from "react-day-picker";

const priorityVariant: { [key in Task['priority']]: "destructive" | "secondary" | "outline" } = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'outline',
};

export default function CalendarPage() {
  const { tasks, members } = useGroup();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const membersMap = React.useMemo(() => new Map(members.map(m => [m.uid, m])), [members]);

  const deadlineDates = React.useMemo(() => {
    return tasks
      .filter(task => task.deadline)
      .map(task => task.deadline!.toDate());
  }, [tasks]);

  const selectedDayTasks = React.useMemo(() => {
    if (!date) return [];
    return tasks
      .filter(task => task.deadline && isSameDay(task.deadline.toDate(), date))
      .sort((a, b) => a.deadline!.toDate().getTime() - b.deadline!.toDate().getTime());
  }, [date, tasks]);

  const CustomDayContent = (props: DayContentProps) => {
    const hasDeadline = deadlineDates.some(d => isSameDay(d, props.date));
    return (
        <div className="relative h-full w-full flex items-center justify-center">
            <span>{format(props.date, 'd')}</span>
            {hasDeadline && !props.activeModifiers.selected && <div className="absolute bottom-1.5 h-1.5 w-1.5 rounded-full bg-primary" />}
        </div>
    );
  };

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">An overview of your team's deadlines and events.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <Card className="lg:col-span-2">
           <CardContent className="pt-6 flex justify-center">
             <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="p-0"
                components={{
                    DayContent: CustomDayContent
                }}
              />
           </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {date ? format(date, 'MMMM d, yyyy') : 'Select a day'}
            </CardTitle>
            <CardDescription>
              {selectedDayTasks.length} task(s) due on this day.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
                <div className="space-y-4 pr-4">
                  {selectedDayTasks.length > 0 ? (
                    selectedDayTasks.map(task => {
                      const assignee = membersMap.get(task.assignedTo);
                      return (
                        <div key={task.id} className="p-3 bg-secondary/50 rounded-lg">
                          <div className="flex justify-between items-start gap-2">
                             <p className="font-semibold text-sm leading-snug flex-1">{task.title}</p>
                             <Badge variant={priorityVariant[task.priority]} className="flex-shrink-0">{task.priority}</Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Avatar className="h-5 w-5">
                                  <AvatarImage src={assignee?.photoURL ?? ''} />
                                  <AvatarFallback>{assignee?.displayName?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{assignee?.displayName ?? 'Unassigned'}</span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center h-full pt-16">
                      <p className="text-muted-foreground">No deadlines for this day.</p>
                    </div>
                  )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}