import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/app/icon";
import { Briefcase, CheckSquare, Users, FolderSync, Bot } from "lucide-react";

const features = [
    {
        icon: Briefcase,
        title: "Unified Project Management",
        description: "Organize, track, and manage all your team's projects from a central dashboard. Keep milestones and deliverables in clear view."
    },
    {
        icon: CheckSquare,
        title: "Streamlined Task Tracking",
        description: "Create, assign, and monitor tasks on a collaborative board. Ensure everyone knows what to do and by when."
    },
    {
        icon: Users,
        title: "Seamless Team Collaboration",
        description: "Manage team members, roles, and permissions. Foster a connected and efficient team environment with a shared workspace."
    },
    {
        icon: FolderSync,
        title: "Intelligent Document Hub",
        description: "A centralized repository for all project files. Upload, describe, and link documents to specific tasks and projects."
    },
    {
        icon: Bot,
        title: "AI-Powered Insights",
        description: "Leverage the power of AI to generate summaries, automate reports, and gain intelligent insights into your workflow. (Coming Soon)"
    }
]

export default function AboutPage() {
    const appVersion = "1.0.0";

    return (
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <AppIcon className="w-10 h-10 text-primary" />
                        <h1 className="text-4xl font-bold tracking-tight">OLTECH AI: Streamline</h1>
                    </div>
                    <p className="text-lg text-muted-foreground">The all-in-one platform to unify your workflow and amplify your impact.</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                        <CardDescription>
                            We empower startups and high-performance teams by providing a smart, integrated, and streamlined workflow management platform. By centralizing projects, tasks, documents, and communication, OLTECH AI helps you focus on what truly matters: building great products and growing your business.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mt-6">
                            <h3 className="text-2xl font-semibold tracking-tight mb-4">Core Features</h3>
                            <ul className="space-y-6">
                                {features.map((feature) => (
                                    <li key={feature.title} className="flex items-start gap-4">
                                        <div className="p-3 bg-primary/10 text-primary rounded-full">
                                            <feature.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-lg">{feature.title}</h4>
                                            <p className="text-muted-foreground">{feature.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>

                 <div className="mt-8 text-center text-sm text-muted-foreground">
                    <p>Version {appVersion}</p>
                    <p>&copy; {new Date().getFullYear()} OLTECH AI. All Rights Reserved.</p>
                </div>
            </div>
        </main>
    );
}
