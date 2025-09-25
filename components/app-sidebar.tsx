"use client"

import { 
  BarChart3, 
  Building2, 
  Megaphone, 
  Key, 
  BookOpen, 
  LogOut,
  Shield,
  FileText
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"

// Navigation items
const mainNavItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "NGOs",
    url: "/ngos",
    icon: Building2,
  },
  {
    title: "Requests",
    url: "/requests",
    icon: FileText,
  },
  {
    title: "Protests",
    url: "/protests", 
    icon: Megaphone,
  },
  {
    title: "Invite Codes",
    url: "/invite-codes",
    icon: Key,
  },
]

const systemNavItems = [
  {
    title: "Guide",
    url: "/guide",
    icon: BookOpen,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="overflow-hidden">
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="w-full">
              <Link href="/" className="flex items-center gap-3 w-full min-w-0">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground flex-shrink-0">
                  <Shield className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                  <span className="truncate font-semibold">Mooja Admin</span>
                  <span className="truncate text-xs text-muted-foreground">Protest Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden">
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="w-full"
                  >
                    <Link href={item.url} className="flex items-center gap-2 w-full min-w-0">
                      <item.icon className="size-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    className="w-full"
                  >
                    <Link href={item.url} className="flex items-center gap-2 w-full min-w-0">
                      <item.icon className="size-4 flex-shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Logout" className="w-full">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 w-full min-w-0"
              >
                <LogOut className="size-4 flex-shrink-0" />
                <span className="truncate">Logout</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
