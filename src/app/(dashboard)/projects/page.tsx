import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { GanttChart, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const projects = [
  {
    name: "Website Redesign",
    status: "In Progress",
    progress: 75,
    team: ["U1", "U2", "U3"],
    deadline: "2024-11-15",
  },
  {
    name: "Project Phoenix",
    status: "On Track",
    progress: 33,
    team: ["U1", "U4", "U5", "U6"],
    deadline: "2025-01-20",
  },
  {
    name: "API Development",
    status: "At Risk",
    progress: 90,
    team: ["U2", "U5"],
    deadline: "2024-10-30",
  },
  {
    name: "Mobile App Q4",
    status: "To Do",
    progress: 15,
    team: ["U3", "U4", "U6"],
    deadline: "2024-12-25",
  },
  {
    name: "Marketing Campaign",
    status: "Completed",
    progress: 100,
    team: ["U1", "U7"],
    deadline: "2024-09-01",
  },
];

const statusVariant: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  "In Progress": "secondary",
  "On Track": "default",
  "At Risk": "destructive",
  "To Do": "outline",
  "Completed": "default",
};

export default function ProjectsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">Manage all your startup's projects.</p>
        </div>
        <Button>+ New Project</Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>All Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Project Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Team</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.name}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusVariant[project.status] || "default"} className={project.status === "Completed" ? "bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400 border-green-500/20" : ""}>{project.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex -space-x-2">
                          {project.team.slice(0, 3).map((user) => (
                            <Avatar key={user} className="h-7 w-7 border-2 border-card">
                              <AvatarImage src={`https://placehold.co/40x40.png`} alt={user} />
                              <AvatarFallback>{user.charAt(1)}</AvatarFallback>
                            </Avatar>
                          ))}
                          {project.team.length > 3 && (
                            <Avatar className="h-7 w-7 border-2 border-card">
                              <AvatarFallback>+{project.team.length - 3}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={project.progress} className="w-24 h-2" />
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Project</DropdownMenuItem>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Milestone Tracking</CardTitle>
              <CardDescription>Visualize project timelines and milestones.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center text-center h-80 bg-secondary/30 rounded-lg">
              <GanttChart className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold">Gantt Chart View</h3>
              <p className="text-sm text-muted-foreground">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
