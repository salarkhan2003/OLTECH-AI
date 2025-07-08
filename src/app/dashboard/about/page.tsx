import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppIcon } from "@/app/icon";
import { Briefcase, CheckSquare, Users, FolderSync, Bot, LayoutGrid, AreaChart, CalendarDays, Bell } from "lucide-react";

const features = [
    {
        icon: LayoutGrid,
        title: "Centralized Dashboard",
        description: "Get a personalized, at-a-glance view of your open tasks, team activity, and overall project progress the moment you log in."
    },
    {
        icon: Briefcase,
        title: "Unified Project Management",
        description: "Organize, track, and manage all your team's projects from a central hub. Set statuses and due dates to keep milestones in clear view."
    },
    {
        icon: CheckSquare,
        title: "Streamlined Task Board",
        description: "Utilize a Kanban-style board to create, assign, and move tasks through 'To Do', 'In Progress', and 'Done' stages. Click any task to view details and update its status."
    },
    {
        icon: Users,
        title: "Seamless Team Collaboration",
        description: "Manage team members, assign roles (Admin, Member), and control permissions. Invite new members easily with a secure join code."
    },
    {
        icon: FolderSync,
        title: "Intelligent Document Hub",
        description: "A centralized repository for all project files. Upload, describe, and link documents directly to specific tasks and projects for perfect organization."
    },
     {
        icon: CalendarDays,
        title: "Shared Calendar",
        description: "View all tasks with deadlines on a shared team calendar. Click on any date to see the tasks due that day, ensuring everyone stays aligned."
    },
    {
        icon: AreaChart,
        title: "Productivity Analytics",
        description: "Visualize your team's workflow with insightful charts showing task distribution by status, open tasks per member, and completion trends over time."
    },
    {
        icon: Bell,
        title: "Activity Notifications",
        description: "Stay informed with a real-time feed of all recent activity, including new projects, tasks, and document uploads from your team."
    },
    {
        icon: Bot,
        title: "AI-Powered Assistant",
        description: "Leverage the power of an integrated AI chatbot. Ask questions about your tasks, projects, or team members and get instant, context-aware answers."
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
                    <p className="text-lg text-muted-foreground">The all-in-one platform to unify your workflow and amplify your team's impact.</p>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Our Mission</CardTitle>
                        <CardDescription>
                            We empower startups and high-performance teams by providing a smart, integrated, and streamlined workflow management platform. By centralizing projects, tasks, documents, and communication, OLTECH AI helps you focus on what truly matters: building great products and growing your business.
                        </CardDescription>
                    </CardHeader>
                </Card>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Core Features</CardTitle>
                        <CardDescription>A complete overview of the platform's capabilities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-6 mt-6">
                            {features.map((feature) => (
                                <li key={feature.title} className="flex items-start gap-4">
                                    <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-lg">{feature.title}</h4>
                                        <p className="text-muted-foreground">{feature.description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader>
                        <CardTitle>How It Works</CardTitle>
                        <CardDescription>A brief look at the technology that powers OLTECH AI: Streamline.</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground space-y-2">
                       <p><strong className="text-foreground">Frontend:</strong> Built with Next.js and React for a modern, fast, and responsive user interface. Styled with Tailwind CSS and ShadCN UI for a consistent and professional design system.</p>
                       <p><strong className="text-foreground">Backend & Database:</strong> Powered by Firebase for robust, scalable, and real-time backend services. We use Firebase Authentication for secure user login (Email/Password & Google), Firestore as our live NoSQL database for all application data, and Firebase Storage for secure document uploads.</p>
                       <p><strong className="text-foreground">Generative AI:</strong> The AI Assistant features are powered by Google's state-of-the-art Gemini models, integrated via the Genkit framework to provide intelligent and helpful responses.</p>
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
