import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format as formatDate, isToday, isYesterday, isThisWeek, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function format(date: string | number | Date, formatStr: string) {
  return formatDate(date, formatStr)
}
