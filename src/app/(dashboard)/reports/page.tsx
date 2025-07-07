import { ReportGenerator } from "@/components/report-generator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Download, FileText } from "lucide-react";

export default function ReportsPage() {
  return (
    <main className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Status Reports</h1>
          <p className="text-muted-foreground">Generate and view AI-powered weekly reports.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ReportGenerator />
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>Your previously generated reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Website Redesign - Week 42</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Generated on Oct 20, 2024
                    </p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
              <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">Project Phoenix - Week 42</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Generated on Oct 19, 2024
                    </p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
               <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">API Development - Week 41</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Generated on Oct 13, 2024
                    </p>
                  </div>
                </div>
                <Download className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
