import { Card, CardContent } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";

export default function ProjectsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
        <p className="text-muted-foreground">Manage your team's projects and milestones.</p>
      </div>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center text-center h-96 bg-secondary/30 rounded-lg">
              <ClipboardCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="font-semibold text-xl">Project Management</h3>
              <p className="text-sm text-muted-foreground mt-2">Coming Soon</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
