/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  User,
  CreditCard,
  ShoppingCart,
  Users,
  Wallet,
  LifeBuoy,
  LogOut,
  Menu,
  ChevronDown,
  ChevronRight,
  Clock,
  Bell,
  Settings,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import UserProfile from "@/components/user-profile";
import LogoutButton from "@/components/logout";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Set initially expanded menus based on current path
    const initialExpandedMenus = navigation
      .filter((item) => item.children && item.current)
      .map((item) => item.name);

    setExpandedMenus(initialExpandedMenus);
  }, [pathname]);

  const toggleMenu = (menuName: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuName)
        ? prev.filter((name) => name !== menuName)
        : [...prev, menuName]
    );
  };

  const navigation = [
    {
      name: "Dashboard",
      href: "/user-dashboard",
      icon: Home,
      current: pathname === "/user-dashboard",
    },
    {
      name: "Profile",
      href: "#",
      icon: User,
      current: pathname.startsWith("/user-dashboard/profile"),
      children: [
        { name: "View Profile", href: "/user-dashboard/profile/view-profile" },
        { name: "Update Profile", href: "/dashboard/profile/update" },
        { name: "KYC Update", href: "/dashboard/profile/kyc" },
      ],
    },
    {
      name: "Bank Details",
      href: "#",
      icon: CreditCard,
      current: pathname.startsWith("/dashboard/bank"),
      children: [
        { name: "Upload Bank Details", href: "/dashboard/bank/upload" },
        { name: "View Bank Details", href: "/dashboard/bank/view" },
      ],
    },
    {
      name: "Purchase",
      href: "#",
      icon: ShoppingCart,
      current: pathname.startsWith("/dashboard/purchase"),
      children: [
        { name: "Order History", href: "/dashboard/purchase/history" },
        { name: "Generate Invoice", href: "/dashboard/purchase/invoice" },
      ],
    },
    {
      name: "Team",
      href: "#",
      icon: Users,
      current: pathname.startsWith("/dashboard/team"),
      children: [
        { name: "Team View", href: "/dashboard/team/view" },
        { name: "My Referrals", href: "/dashboard/team/referrals" },
      ],
    },
    {
      name: "Income",
      href: "#",
      icon: Wallet,
      current: pathname.startsWith("/dashboard/income"),
      children: [
        { name: "Referral Income", href: "/dashboard/income/referral" },
        { name: "Salary", href: "/dashboard/income/salary" },
      ],
    },
    {
      name: "Payments",
      href: "#",
      icon: CreditCard,
      current: pathname.startsWith("/dashboard/payments"),
      children: [
        { name: "Available Balance", href: "/dashboard/payments/balance" },
        { name: "Withdraw Request", href: "/dashboard/payments/withdraw" },
        { name: "Withdraw History", href: "/dashboard/payments/history" },
        {
          name: "Promotional Material",
          href: "/dashboard/payments/promotional",
        },
      ],
    },
    {
      name: "Support",
      href: "/dashboard/support",
      icon: LifeBuoy,
      current: pathname === "/dashboard/support",
    },
  ];

  return (
    <div className="flex min-h-screen bg-orange-50">
      {/* Mobile navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-9 w-9 rounded-md flex items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={36} height={36} />

          </div>
          <span className="font-semibold text-lg text-orange-900">
            नव सृष्टि सृजन
          </span>
        

        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-orange-600 relative"
          >
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-9 w-9 border-2 border-orange-200">
                  <AvatarImage src="/placeholder.svg" alt="User" />
                  <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                    MS
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <a href="/dashboard/profile">Profile</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/dashboard/settings">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" asChild>
                <a href="/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <div className="flex h-full flex-col">
                <div className="border-b p-5 bg-gradient-to-r from-orange-50 to-amber-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-orange-200">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                        MS
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      {/* <p className="text-base font-medium text-orange-900">
                        Mehul Singh
                      </p>
                      <p className="text-sm text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full inline-block">
                        REF123
                      </p> */}
                      <UserProfile/>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-lg bg-white border border-orange-200 p-3 shadow-sm">
                    <Clock className="h-5 w-5 text-orange-600" />
                    <span className="text-sm font-medium text-orange-800">
                      23 days remaining
                    </span>
                    <Button
                      size="sm"
                      className="ml-auto bg-orange-600 hover:bg-orange-700 text-xs py-0 h-7"
                    >
                      Upgrade
                    </Button>
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <nav className="grid gap-1 p-3">
                    {navigation.map((item) => (
                      <div key={item.name}>
                        {!item.children ? (
                          <Button
                            variant={item.current ? "secondary" : "ghost"}
                            className={cn(
                              "w-full justify-start py-3 text-base",
                              item.current
                                ? "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 font-medium"
                                : ""
                            )}
                            onClick={() => setMobileOpen(false)}
                            asChild
                          >
                            <a href={item.href}>
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                            </a>
                          </Button>
                        ) : (
                          <div className="space-y-1">
                            <Button
                              variant={item.current ? "secondary" : "ghost"}
                              className={cn(
                                "w-full justify-start py-3 text-base",
                                item.current
                                  ? "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 font-medium"
                                  : ""
                              )}
                              onClick={() => toggleMenu(item.name)}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                              {expandedMenus.includes(item.name) ? (
                                <ChevronDown className="ml-auto h-5 w-5" />
                              ) : (
                                <ChevronRight className="ml-auto h-5 w-5" />
                              )}
                            </Button>

                            {expandedMenus.includes(item.name) && (
                              <div className="ml-8 space-y-1 border-l border-orange-200 pl-4">
                                {item.children.map((child) => (
                                  <Button
                                    key={child.name}
                                    variant="ghost"
                                    className="w-full justify-start py-2 text-sm"
                                    onClick={() => setMobileOpen(false)}
                                    asChild
                                  >
                                    <a href={child.href}>{child.name}</a>
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
                <div className="border-t p-4 bg-orange-50">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 py-3 text-base"
                    asChild
                  >
                    <a href="/logout">
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Desktop navigation */}
      <SidebarProvider defaultOpen={true}>
        <Sidebar
          className="hidden md:flex border-r border-orange-200 w-64 bg-gradient-to-b from-white to-orange-50"
          variant="sidebar"
          collapsible="icon"
        >
          <SidebarHeader className="border-b border-orange-200 h-16 flex items-center px-5">
            <div className="flex items-center gap-3 w-full overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-9 w-9 rounded-md flex items-center justify-center shrink-0">
                {/* <span className="text-white font-bold text-lg">न</span> */}
                <Image src="/logo.png" alt="Logo" width={36} height={36} />


              </div>
              <span className="font-semibold text-lg text-orange-900 truncate">
                नव सृष्टि सृजन
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-5 overflow-y-auto">
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.name} className="mb-2">
                  {!item.children ? (
                    <SidebarMenuButton
                      asChild
                      isActive={item.current}
                      tooltip={item.name}
                      className={cn(
                        "py-3 text-base hover:bg-orange-100 transition-colors",
                        item.current &&
                          "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 font-medium"
                      )}
                    >
                      <a href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  ) : (
                    <div>
                      <SidebarMenuButton
                        isActive={item.current}
                        tooltip={item.name}
                        className={cn(
                          "py-3 text-base hover:bg-orange-100 transition-colors",
                          item.current &&
                            "bg-gradient-to-r from-orange-100 to-amber-100 text-orange-900 font-medium"
                        )}
                        onClick={() => toggleMenu(item.name)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                        {expandedMenus.includes(item.name) ? (
                          <ChevronDown className="ml-auto h-5 w-5" />
                        ) : (
                          <ChevronRight className="ml-auto h-5 w-5" />
                        )}
                      </SidebarMenuButton>

                      {expandedMenus.includes(item.name) && (
                        <div className="ml-8 space-y-1 border-l border-orange-200 pl-4 mt-1 animate-in slide-in-from-top duration-150">
                          {item.children.map((child) => {
                            const isActive = pathname === child.href;
                            return (
                              <Button
                                key={child.name}
                                variant="ghost"
                                className={cn(
                                  "w-full justify-start py-2 text-sm",
                                  isActive
                                    ? "bg-orange-100 text-orange-900 font-medium"
                                    : ""
                                )}
                                asChild
                              >
                                <a href={child.href}>{child.name}</a>
                              </Button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter
            className={cn(
              "transition-all",
              sidebarOpen ? "border-t border-orange-200 p-4" : "p-2"
            )}
          >
            {sidebarOpen ? (
              <div className="flex items-center gap-3 w-full bg-gradient-to-r from-orange-100 to-amber-100 rounded-lg p-3">
                
                <div className="flex flex-col min-w-0 flex-1">
                  {/* <span className="text-sm font-medium truncate text-orange-900">
                    Mehul Singh
                  </span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-orange-700 inline-block w-fit">
                    REF123
                  </span> */}
                  <UserProfile/>
                  <LogoutButton />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-8 w-8 rounded-full bg-white text-orange-700 hover:text-orange-900"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <a href="/dashboard/profile">Profile</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/dashboard/settings">Settings</a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" asChild>
                      <a href="/logout">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full p-0"
                  >
                    <Avatar className="h-10 w-10 border-2 border-orange-200">
                      <AvatarImage src="/placeholder.svg" alt="User" />
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                        MS
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mehul Singh</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/dashboard/profile">Profile</a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/dashboard/settings">Settings</a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" asChild>
                    <a href="/logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarFooter>
        </Sidebar>
        <div className="flex-1">
          <div className="flex flex-col">
            <header className="sticky top-0 z-30 hidden h-16 items-center gap-4 border-b bg-white px-6 md:flex shadow-sm">
              <SidebarTrigger />
              <div className="flex-1" />
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="bg-white border-orange-200 hover:bg-orange-50"
                >
                  <Clock className="mr-2 h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">
                    23 days remaining
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-orange-600 relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-orange-500">
                    3
                  </Badge>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <Avatar className="h-9 w-9 border-2 border-orange-200">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback className="bg-gradient-to-br from-orange-400 to-amber-500 text-white">
                          MS
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <a href="/dashboard/profile">Profile</a>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <a href="/dashboard/settings">Settings</a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600" asChild>
                      <a href="/logout">Logout</a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-6 md:pt-6 pt-24">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
