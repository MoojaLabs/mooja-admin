"use client"

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedRoute } from "@/components/protected-route";
import { useAuth } from "@/lib/auth-context";

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, loading } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't show sidebar on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!mounted || loading) {
    return (
      <div className="flex h-screen w-full overflow-hidden">
        <div className="w-64 border-r bg-sidebar p-4 overflow-hidden">
          <div className="h-8 w-32 animate-pulse rounded bg-sidebar-accent" />
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="h-16 border-b bg-background" />
          <div className="p-4 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-hidden">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <div className="h-4 w-px bg-sidebar-border" />
            <h1 className="text-lg font-semibold">Mooja Admin</h1>
            <div className="ml-auto flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </header>
          <main className="flex-1 p-4 overflow-auto" style={{ contain: 'layout' }}>
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
