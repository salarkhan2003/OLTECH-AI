'use client';

import * as React from 'react';
import { SendHorizonal, Bot, User, CornerDownLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/components/auth-provider';
import { useGroup } from '@/components/group-provider';
import { askAssistant } from '@/ai/flows/assistant-flow';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const suggestedPrompts = [
    "Do I have any open tasks?",
    "Summarize my high-priority tasks.",
    "Who is on my team?",
    "Which tasks are due this week?",
];

export default function AIAssistantPage() {
  const { userProfile } = useAuth();
  const { tasks, members } = useGroup();

  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent, prompt?: string) => {
    e.preventDefault();
    const currentMessage = prompt || input;
    if (!currentMessage.trim()) return;

    setIsLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: currentMessage }]);
    setInput('');

    // Prepare context for the AI
    const myOpenTasks = tasks.filter(t => t.assignedTo === userProfile?.uid && t.status !== 'Done');
    
    let context = `The current user is ${userProfile?.displayName}.\n\n`;

    context += "Current user's open tasks:\n";
    if (myOpenTasks.length > 0) {
      myOpenTasks.forEach(task => {
        context += `- Title: "${task.title}", Priority: ${task.priority}, Status: ${task.status}, Due: ${task.deadline ? task.deadline.toDate().toLocaleDateString() : 'N/A'}\n`;
      });
    } else {
      context += "No open tasks.\n";
    }

    context += "\nTeam Members:\n";
    if (members.length > 0) {
        members.forEach(member => {
            context += `- ${member.displayName} (${member.email})\n`;
        });
    } else {
        context += "No team members found.\n";
    }

    try {
      const response = await askAssistant({ message: currentMessage, context });
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // Auto-scroll to bottom
    if (scrollAreaRef.current) {
      scrollAreaRef.current.children[1].scrollTop = scrollAreaRef.current.children[1].scrollHeight;
    }
  }, [messages]);

  return (
    <main className="p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100svh-4rem)]">
        <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
            <p className="text-muted-foreground">Your intelligent partner for productivity.</p>
        </div>

        <Card className="flex-1 flex flex-col">
            <CardContent className="pt-6 flex-1 flex flex-col">
                <ScrollArea className="flex-1 -mx-6 px-6" ref={scrollAreaRef}>
                    <div className="space-y-6 pr-4">
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center text-center h-full pt-16">
                                <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                                <h3 className="font-semibold text-xl">OLTECH AI Assistant</h3>
                                <p className="text-sm text-muted-foreground mt-2">How can I help you streamline your workflow today?</p>
                                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                    {suggestedPrompts.map(prompt => (
                                        <Button 
                                            key={prompt}
                                            variant="outline"
                                            className="text-left h-auto py-2"
                                            onClick={(e) => handleSubmit(e, prompt)}
                                            disabled={isLoading}
                                        >
                                            {prompt}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}
                        {messages.map((message, index) => (
                            <div key={index} className={cn("flex items-start gap-4", message.role === 'user' && 'justify-end')}>
                                {message.role === 'assistant' && (
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarFallback><Bot size={20} /></AvatarFallback>
                                    </Avatar>
                                )}
                                <div className={cn("max-w-md rounded-lg px-4 py-2", message.role === 'assistant' ? 'bg-secondary' : 'bg-primary text-primary-foreground')}>
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                    <Avatar className="h-9 w-9 border">
                                        <AvatarImage src={userProfile?.photoURL ?? ''} />
                                        <AvatarFallback><User size={20} /></AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                        ))}
                         {isLoading && (
                            <div className="flex items-start gap-4">
                                <Avatar className="h-9 w-9 border">
                                    <AvatarFallback><Bot size={20} /></AvatarFallback>
                                </Avatar>
                                <div className="max-w-md rounded-lg px-4 py-2 bg-secondary flex items-center gap-2">
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-0"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-150"></span>
                                    <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                         )}
                    </div>
                </ScrollArea>
                <form onSubmit={handleSubmit} className="mt-6 relative">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about your tasks, projects, or team..."
                        className="pr-12 h-12 text-base"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2"
                        disabled={isLoading}
                    >
                        <SendHorizonal size={20} />
                    </Button>
                </form>
            </CardContent>
        </Card>
    </main>
  );
}
