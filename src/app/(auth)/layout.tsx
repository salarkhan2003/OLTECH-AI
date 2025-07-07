import { AppIcon } from "@/app/icon";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4">
        <div className="w-full max-w-md">
            <div className="mb-6 flex justify-center">
                 <div className="flex items-center gap-2">
                    <AppIcon className="w-8 h-8 text-primary" />
                    <h1 className="text-xl font-bold tracking-tight">OLTECH AI: Streamline</h1>
                </div>
            </div>
            {children}
        </div>
    </div>
  )
}
