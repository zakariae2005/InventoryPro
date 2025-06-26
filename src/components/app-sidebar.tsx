"use client"

import { BarChart3, Package, ShoppingCart, CreditCard, Building2 } from "lucide-react"
import Link from "next/link"

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
    url: "/",
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
  return (
    <Sidebar className="border-r border-gray-100 bg-white/80 backdrop-blur-sm">
      <SidebarHeader className="border-b border-gray-50 pb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-gray-50/80 transition-all duration-200">
              <Link href="/">
                <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br from-slate-900 to-slate-700 text-white shadow-sm">
                  <Building2 className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                  <span className="truncate font-bold text-slate-900 text-base">StockFlow</span>
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
                    className="hover:bg-slate-50 hover:text-slate-900 transition-all duration-200 rounded-lg px-3 py-2.5 group"
                  >
                    <Link href={item.url} className="flex items-center space-x-3">
                      <item.icon className="size-4 text-slate-600 group-hover:text-slate-900 transition-colors" />
                      <span className="font-medium text-slate-700 group-hover:text-slate-900">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-gray-50 pt-4 mt-auto">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="hover:bg-gray-50/80 transition-all duration-200 rounded-lg p-3">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200">
                <span className="text-sm font-bold text-slate-700">JD</span>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight ml-3">
                <span className="truncate font-semibold text-slate-900">John Doe</span>
                <span className="truncate text-xs text-slate-500 font-medium">Administrator</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}