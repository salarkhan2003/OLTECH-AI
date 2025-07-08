
'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, Pie, PieChart, Cell, ResponsiveContainer, Area, AreaChart, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useGroup } from '@/components/group-provider';
import { subDays, format, startOfDay } from 'date-fns';

const CHART_COLORS = {
  "To Do": "hsl(var(--chart-1))",
  "In Progress": "hsl(var(--chart-2))",
  "Done": "hsl(var(--chart-3))",
};

export default function AnalyticsPage() {
  const { tasks, members } = useGroup();

  const tasksByStatus = React.useMemo(() => {
    const counts = { 'To Do': 0, 'In Progress': 0, 'Done': 0 };
    tasks.forEach(task => {
      if (task.status in counts) {
        counts[task.status]++;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value, fill: CHART_COLORS[name as keyof typeof CHART_COLORS] }));
  }, [tasks]);

  const tasksPerMember = React.useMemo(() => {
    const memberMap = new Map(members.map(m => [m.uid, { name: m.displayName, openTasks: 0 }]));
    tasks.forEach(task => {
      if (task.status !== 'Done' && memberMap.has(task.assignedTo)) {
        memberMap.get(task.assignedTo)!.openTasks++;
      }
    });
    return Array.from(memberMap.values());
  }, [tasks, members]);
  
  const completionTrend = React.useMemo(() => {
    const thirtyDaysAgo = startOfDay(subDays(new Date(), 29));
    const trendData: { [key: string]: number } = {};

    for (let i = 0; i < 30; i++) {
        const date = subDays(new Date(), i);
        const formattedDate = format(date, 'MMM d');
        trendData[formattedDate] = 0;
    }

    tasks.forEach(task => {
        if (task.status === 'Done' && task.createdAt.toDate() >= thirtyDaysAgo) {
            const formattedDate = format(task.createdAt.toDate(), 'MMM d');
            if (formattedDate in trendData) {
                trendData[formattedDate]++;
            }
        }
    });

    return Object.entries(trendData).map(([date, count]) => ({ date, count })).reverse();
  }, [tasks]);


  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Insights into your team's productivity.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Task Status</CardTitle>
            <CardDescription>Distribution of tasks by their current status.</CardDescription>
          </CardHeader>
          <CardContent>
             <ChartContainer config={{}} className="mx-auto aspect-square h-[250px]">
              <PieChart>
                <RechartsTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={tasksByStatus} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                   {tasksByStatus.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Open Tasks per Member</CardTitle>
            <CardDescription>Number of "To Do" and "In Progress" tasks assigned to each member.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{ tasks: { label: "Tasks" } }} className="h-[250px] w-full">
              <BarChart data={tasksPerMember} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
                <RechartsTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="openTasks" fill="var(--color-tasks)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
            <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
                <CardDescription>Tasks completed over the last 30 days.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={{ count: { label: "Tasks" } }} className="h-[300px] w-full">
                  <AreaChart data={completionTrend} margin={{ left: 12, right: 12 }}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} tickCount={8} />
                    <RechartsTooltip content={<ChartTooltipContent indicator="dot" />} />
                    <Area dataKey="count" type="natural" fill="var(--color-area)" fillOpacity={0.4} stroke="var(--color-area)" stackId="a" />
                  </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </div>
    </main>
  );
}
