"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    // Render a placeholder or null on the server and initial client render
    return <div className="flex items-center space-x-2 h-11 w-24" />;
  }

  return (
    <div className="flex items-center space-x-2 bg-secondary rounded-full p-1">
      <Button
        variant={theme === 'light' ? 'primary' : 'ghost'}
        size="icon"
        onClick={() => setTheme('light')}
        aria-label="Switch to light mode"
        className={cn("btn-touch rounded-full")}
      >
        <Sun className="h-6 w-6" />
      </Button>
      <Button
        variant={theme === 'dark' ? 'primary' : 'ghost'}
        size="icon"
        onClick={() => setTheme('dark')}
        aria-label="Switch to dark mode"
        className={cn("btn-touch rounded-full", theme === 'dark' && 'bg-primary/80 text-primary-foreground')}
      >
        <Moon className="h-6 w-6" />
      </Button>
    </div>
  )
}
