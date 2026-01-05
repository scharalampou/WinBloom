"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const isDarkMode = theme === 'dark';

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }

  return (
    <div className="flex items-center space-x-2">
      <Switch
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
        checkedIcon={<Moon className="h-4 w-4 text-primary-foreground" />}
        uncheckedIcon={<Sun className="h-4 w-4 text-accent-foreground" />}
      />
    </div>
  )
}
