import { BookOpen, Clock } from "lucide-react";

export default function GuidePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guide</h1>
          <p className="text-muted-foreground">
            Learn how to use the Mooja Admin Dashboard
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Clock className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Guide Coming Soon</h2>
        <p className="text-muted-foreground max-w-md">
          We're working on a comprehensive guide to help you navigate and use all the features of the Mooja Admin Dashboard. Check back soon!
        </p>
      </div>
    </div>
  );
}
