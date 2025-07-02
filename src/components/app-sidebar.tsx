"use client"

import { BarChart3, Package, ShoppingCart, CreditCard, Building2, LogOut } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"
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
} from "@/components/ui/sidebar"

// Navigation items
const items = [
  {
    title: "Overview",
    url: "/overview",
    icon: BarChart3,
  },
  {
    title: "Products",
    url: "/products",
    icon: Package,
  },
  {
    title: "Sales",
    url: "/sales-management",
    icon: ShoppingCart,
  },
  {
    title: "Debts",
    url: "/debts-management",
    icon: CreditCard,
  },
]

export function AppSidebar() {
  const { data: session } = useSession();
  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" }) // Redirect to login page after sign out
  }

  return (
    <Sidebar className="border-r border-slate-200/60 bg-gradient-to-b from-slate-50/95 to-white/95 backdrop-blur-sm shadow-sm">
      <SidebarHeader className="border-b border-slate-100/80 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-blue-50/60 transition-all duration-300 ease-in-out">
              <Link href="/">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow duration-300">
                  <Building2 className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-bold text-slate-800 text-base">InventoryPro</span>
                  <span className="truncate text-xs text-slate-500 font-medium">Stock Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:text-slate-900 hover:shadow-sm transition-all duration-300 ease-in-out rounded-lg px-3 py-2.5 group border border-transparent hover:border-blue-100/50"
                  >
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="size-4 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" />
                      <span className="font-medium text-slate-600 group-hover:text-slate-800 transition-colors duration-300">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-slate-100/80 pt-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-slate-50/80 transition-all duration-300 rounded-lg p-3 group">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 border border-emerald-200/50 shadow-sm">
                <span className="text-sm font-bold text-emerald-700">IP</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                <span className="font-medium text-slate-700 group-hover:text-slate-800 transition-colors duration-300">
                  {session?.user?.name || "Guest"}
                </span>
                <span className="truncate text-xs text-slate-500 font-medium">Administrator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="my-4">
            <SidebarMenuButton 
              onClick={handleSignOut}
              className="hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700 hover:shadow-sm transition-all duration-300 ease-in-out rounded-lg px-3 py-2.5 group cursor-pointer border border-transparent hover:border-red-100/50"
            >
              <LogOut className="size-4 text-slate-500 group-hover:text-red-600 transition-colors duration-300" />
              <span className="font-medium text-slate-600 group-hover:text-red-700 ml-3 transition-colors duration-300">Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}