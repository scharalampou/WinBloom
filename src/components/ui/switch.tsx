"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"
import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

type SwitchProps = React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
};

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "group",
      "relative inline-flex h-7 w-14 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50",
      "bg-card",
      className
    )}
    {...props}
    ref={ref}
  >
    <div className="absolute left-2.5 z-0 text-primary/60 transition-colors group-data-[state=checked]:text-primary-foreground">
      <Sun className="h-4 w-4" />
    </div>
    <div className="absolute right-2.5 z-0 text-primary/60 transition-colors group-data-[state=unchecked]:text-primary-foreground">
      <Moon className="h-4 w-4" />
    </div>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none z-10 flex h-6 w-6 items-center justify-center rounded-full bg-primary shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-[1.8rem] data-[state=unchecked]:translate-x-0.5"
      )}
    >
       {props.checked ? props.checkedIcon : props.uncheckedIcon}
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
