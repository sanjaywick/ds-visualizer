"use client"

import React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { BarChart2, GitBranch, Home, ListOrdered, ListTree, Lightbulb, ArrowUpDown } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const routes = [
    {
      name: "Home",
      path: "/",
      icon: <Home className="h-4 w-4 mr-2" />,
    },
    {
      name: "Stack",
      path: "/stack",
      icon: <BarChart2 className="h-4 w-4 mr-2" />,
    },
    {
      name: "Queue",
      path: "/queue",
      icon: <ListOrdered className="h-4 w-4 mr-2" />,
    },
    {
      name: "Linked List",
      path: "/linked-list",
      icon: <GitBranch className="h-4 w-4 mr-2" />,
    },
    {
      name: "Binary Tree",
      path: "/binary-tree",
      icon: <ListTree className="h-4 w-4 mr-2" />,
    },
    {
      name: "Sorting",
      path: "/sorting",
      icon: <ArrowUpDown className="h-4 w-4 mr-2" />,
    },
    {
      name: "Design Techniques",
      path: "/design-techniques",
      icon: <Lightbulb className="h-4 w-4 mr-2" />,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">Struct Assist</span>
          </Link>
          <nav className="flex items-center space-x-2 text-sm">
            {routes.map((route) => (
              <Button
                key={route.path}
                variant={pathname === route.path ? "default" : "ghost"}
                size="sm"
                className={cn("h-8", pathname === route.path && "bg-primary text-primary-foreground")}
                asChild
              >
                <Link href={route.path}>
                  {route.icon}
                  {route.name}
                </Link>
              </Button>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center md:hidden">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <Home className="h-5 w-5" />
                <span className="sr-only">Home</span>
              </Link>
            </Button>
            {routes.slice(1).map((route) => (
              <Button
                key={route.path}
                variant={pathname === route.path ? "default" : "ghost"}
                size="icon"
                className={cn(pathname === route.path && "bg-primary text-primary-foreground")}
                asChild
              >
                <Link href={route.path}>
                  {React.cloneElement(route.icon, { className: "h-5 w-5" })}
                  <span className="sr-only">{route.name}</span>
                </Link>
              </Button>
            ))}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
