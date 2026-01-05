
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
    // Render a placeholder to prevent layout shift
    return <Button variant="ghost" size="icon" className="btn-touch rounded-full h-11 w-11" disabled />;
  }

  const isLight = theme === 'light';

  const toggleTheme = () => {
    setTheme(isLight ? 'dark' : 'light');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} mode`}
      className={cn(
        "btn-touch rounded-full h-11 w-11 transition-colors duration-300",
        isLight 
          ? "bg-black text-white hover:bg-gray-800 hover:text-gray-300" 
          : "bg-yellow-400 text-black hover:bg-yellow-500"
      )}
    >
      {isLight ? (
        <Sun className="h-6 w-6 transform transition-transform duration-500 rotate-0 scale-100" />
      ) : (
        <Moon className="h-6 w-6 transform transition-transform duration-500 rotate-90 scale-100" />
      )}
    </Button>
  )
}
