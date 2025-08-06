"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Menu, Search, Bell, Settings, User, LogOut, HelpCircle, Sprout, MapPin, Sun, CloudRain, TrendingUp, ShoppingCart, Users, Calculator, Stethoscope, FileText, BarChart3, Home, Star, Calendar, MessageSquare, Bookmark, Droplets } from 'lucide-react'
import { cn } from "@/lib/utils"
import { useLocation } from "@/components/location-context"
import { LocationSetup } from "@/components/location-setup"

// Organized navigation structure
const navigationGroups = {
  farming: {
    title: "Farming Tools",
    icon: Sprout,
    items: [
      { name: "Dashboard", href: "/", icon: Home, description: "Overview of your farm activities" },
      {
        name: "Crop Planner",
        href: "/crop-planner",
        icon: Sprout,
        description: "AI-powered crop planning and task management",
      },
      {
        name: "Plant Doctor",
        href: "/plant-doctor",
        icon: Stethoscope,
        description: "Disease diagnosis and treatment",
      },
      { name: "Weather Scheduler", href: "/weather", icon: CloudRain, description: "Weather-based task scheduling" },
      {
        name: "Irrigation Planner",
        href: "/irrigation",
        icon: Droplets,
        description: "Smart irrigation planning and water management",
      },
      {
        name: "Fertilizer Calculator",
        href: "/fertilizer",
        icon: Calculator,
        description: "Optimize fertilizer usage",
      },
    ],
  },
  market: {
    title: "Market & Commerce",
    icon: TrendingUp,
    items: [
      { name: "Market Prices", href: "/market", icon: TrendingUp, description: "Real-time crop prices" },
      {
        name: "Market Insights",
        href: "/market-insights",
        icon: BarChart3,
        description: "Selling opportunities and trends",
      },
      { name: "Agri Store", href: "/store", icon: ShoppingCart, description: "Buy farming supplies" },
      {
        name: "Schemes & Subsidies",
        href: "/schemes",
        icon: FileText,
        description: "Government programs and benefits",
      },
    ],
  },
  community: {
    title: "Community & Support",
    icon: Users,
    items: [
      { name: "Farmer Community", href: "/community", icon: Users, description: "Connect with fellow farmers" },
      { name: "Expert Consultation", href: "/consultation", icon: MessageSquare, description: "Get expert advice" },
      { name: "Learning Center", href: "/learning", icon: Star, description: "Farming tutorials and guides" },
    ],
  },
}

// Quick actions for command palette
const quickActions = [
  { name: "Check Weather", href: "/weather", icon: CloudRain, shortcut: "⌘W" },
  { name: "Diagnose Plant", href: "/plant-doctor", icon: Stethoscope, shortcut: "⌘D" },
  { name: "Market Prices", href: "/market", icon: TrendingUp, shortcut: "⌘M" },
  { name: "Calculate Fertilizer", href: "/fertilizer", icon: Calculator, shortcut: "⌘F" },
  { name: "Irrigation Plan", href: "/irrigation", icon: Droplets, shortcut: "⌘I" },
  { name: "Community", href: "/community", icon: Users, shortcut: "⌘C" },
]

// Recent activities (mock data)
const recentActivities = [
  { name: "Tomato Disease Diagnosis", href: "/plant-doctor", time: "2 hours ago" },
  { name: "Weather Alert: Rain Expected", href: "/weather", time: "4 hours ago" },
  { name: "Irrigation Plan Updated", href: "/irrigation", time: "6 hours ago" },
  { name: "Fertilizer Plan Updated", href: "/fertilizer", time: "1 day ago" },
]

// Notifications (mock data)
const notifications = [
  { id: 1, title: "Weather Alert", message: "Heavy rain expected tomorrow", type: "warning", time: "5 min ago" },
  { id: 2, title: "Market Update", message: "Tomato prices increased by 15%", type: "info", time: "1 hour ago" },
  { id: 3, title: "Irrigation Reminder", message: "Tomato Field A irrigation due in 2 hours", type: "reminder", time: "2 hours ago" },
  { id: 4, title: "Task Reminder", message: "Apply fertilizer to wheat crop", type: "reminder", time: "4 hours ago" },
]

export function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { location, isLocationSet, showLocationSetup, setShowLocationSetup, setLocation } = useLocation()

  // Keyboard shortcut for command palette
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "warning":
        return "text-orange-600 bg-orange-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      case "reminder":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const unreadNotifications = notifications.filter((n) => n.id <= 3).length

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Logo */}
          <div className="mr-6 flex items-center space-x-2">
            <Link className="flex items-center space-x-2" href="/">
              <div className="relative">
                <Sprout className="h-8 w-8 text-green-600" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
                  FarmSmart
                </span>
                <div className="text-xs text-muted-foreground -mt-1">AI Agriculture</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1">
            <NavigationMenu>
              <NavigationMenuList>
                {Object.entries(navigationGroups).map(([key, group]) => (
                  <NavigationMenuItem key={key}>
                    <NavigationMenuTrigger className="h-9">
                      <group.icon className="mr-2 h-4 w-4" />
                      {group.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid w-[600px] grid-cols-2 gap-3 p-4">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href && "bg-accent text-accent-foreground",
                            )}
                          >
                            <div className="flex items-center space-x-2">
                              <item.icon className="h-4 w-4" />
                              <div className="text-sm font-medium leading-none">{item.name}</div>
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-sm mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tools, crops, diseases... (⌘K)"
                className="pl-10 pr-4 h-9 bg-muted/50"
                onClick={() => setCommandOpen(true)}
                readOnly
              />
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Location Indicator */}
            <Button variant="ghost" size="sm" onClick={() => setShowLocationSetup(true)} className="hidden md:flex h-9">
              <MapPin className="h-4 w-4 mr-1" />
              {isLocationSet ? (
                <div className="flex items-center space-x-1">
                  <span className="text-xs font-medium">{location?.district}</span>
                  <Badge variant="outline" className="h-4 px-1 text-xs">
                    {location?.state}
                  </Badge>
                </div>
              ) : (
                <span className="text-xs">Set Location</span>
              )}
              {!isLocationSet && (
                <Badge variant="destructive" className="ml-1 h-4 w-4 p-0 text-xs">
                  !
                </Badge>
              )}
            </Button>

            {/* Weather Quick Info */}
            {isLocationSet && (
              <div className="hidden lg:flex items-center space-x-1 px-2 py-1 bg-muted/50 rounded-md">
                <Sun className="h-3 w-3 text-orange-500" />
                <span className="text-xs font-medium">28°C</span>
              </div>
            )}

            {/* Search Button (Mobile) */}
            <Button variant="ghost" size="sm" className="md:hidden h-9 w-9 p-0" onClick={() => setCommandOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative h-9 w-9 p-0">
                  <Bell className="h-4 w-4" />
                  {unreadNotifications > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">{unreadNotifications}</Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                  <span>Notifications</span>
                  <Badge variant="secondary">{unreadNotifications} new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map((notification) => (
                    <DropdownMenuItem key={notification.id} className="flex-col items-start p-3">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex-1">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-muted-foreground mt-1">{notification.message}</div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs ${getNotificationColor(notification.type)}`}>
                          {notification.type}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">{notification.time}</div>
                    </DropdownMenuItem>
                  ))}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-center text-sm text-muted-foreground">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Farmer" />
                    <AvatarFallback className="bg-green-100 text-green-700">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Rajesh Kumar</p>
                    <p className="text-xs leading-none text-muted-foreground">rajesh.farmer@email.com</p>
                    {location && (
                      <p className="text-xs leading-none text-muted-foreground">
                        📍 {location.district}, {location.state}
                      </p>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowLocationSetup(true)}>
                  <MapPin className="mr-2 h-4 w-4" />
                  <span>Farm Location</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Saved Items</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <HelpCircle className="mr-2 h-4 w-4" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden h-9 w-9 p-0">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Sprout className="h-6 w-6 text-green-600" />
                    <span>FarmSmart</span>
                  </SheetTitle>
                  <SheetDescription>Your AI-powered agricultural assistant</SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  {/* Location in Mobile */}
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowLocationSetup(true)
                        setIsOpen(false)
                      }}
                      className="w-full justify-start h-auto p-0"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="text-sm font-medium">
                          {isLocationSet ? `${location?.district}, ${location?.state}` : "Set Location"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {isLocationSet ? "Tap to change" : "Get personalized recommendations"}
                        </div>
                      </div>
                    </Button>
                  </div>

                  {/* Navigation Groups */}
                  {Object.entries(navigationGroups).map(([key, group]) => (
                    <div key={key}>
                      <div className="flex items-center space-x-2 px-3 py-2 text-sm font-semibold text-muted-foreground">
                        <group.icon className="h-4 w-4" />
                        <span>{group.title}</span>
                      </div>
                      <div className="space-y-1">
                        {group.items.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center space-x-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                              pathname === item.href && "bg-accent text-accent-foreground",
                            )}
                          >
                            <item.icon className="h-4 w-4" />
                            <span>{item.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Recent Activities */}
                  <div>
                    <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">Recent Activities</div>
                    <div className="space-y-1">
                      {recentActivities.map((activity, index) => (
                        <Link
                          key={index}
                          href={activity.href}
                          onClick={() => setIsOpen(false)}
                          className="block px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <div className="font-medium">{activity.name}</div>
                          <div className="text-xs text-muted-foreground">{activity.time}</div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Command Palette */}
      <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
        <CommandInput placeholder="Search tools, crops, diseases..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            {quickActions.map((action) => (
              <CommandItem
                key={action.href}
                onSelect={() => {
                  setCommandOpen(false)
                  window.location.href = action.href
                }}
              >
                <action.icon className="mr-2 h-4 w-4" />
                <span>{action.name}</span>
                <div className="ml-auto text-xs text-muted-foreground">{action.shortcut}</div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          {Object.entries(navigationGroups).map(([key, group]) => (
            <CommandGroup key={key} heading={group.title}>
              {group.items.map((item) => (
                <CommandItem
                  key={item.href}
                  onSelect={() => {
                    setCommandOpen(false)
                    window.location.href = item.href
                  }}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{item.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Recent">
            {recentActivities.map((activity, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  setCommandOpen(false)
                  window.location.href = activity.href
                }}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>{activity.name}</span>
                <div className="ml-auto text-xs text-muted-foreground">{activity.time}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      {/* Location Setup Dialog */}
      <LocationSetup
        isOpen={showLocationSetup}
        onClose={() => setShowLocationSetup(false)}
        onLocationSet={setLocation}
        currentLocation={location}
      />
    </>
  )
}
