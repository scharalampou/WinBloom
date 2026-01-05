
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { WinLog } from '@/app/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Leaf } from 'lucide-react';
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  parseISO,
  subDays,
  startOfToday,
  startOfWeek,
} from 'date-fns';

const encouragingMessages = [
  "Even the earth needs a day of rest to bloom. See you tomorrow!",
  "No dewdrops today? Your garden is still rooting for you.",
  "Rest is productive, too. Your seedling is waiting whenever you are ready.",
  "Taking a break is part of the process. Breathe and be kind to yourself.",
  "Existing is a full-time job. You're doing great just being here.",
];

// Mock wins and gratitudes for demonstration
const mockWins = [
    "Finished a book I've been reading for months.",
    "Cooked a new recipe and it was delicious.",
    "Went for a long walk and enjoyed the fresh air.",
    "Organized my desk and feel much more productive.",
    "Finally called that friend I've been meaning to.",
    "Woke up without hitting the snooze button.",
    "Fixed that wobbly chair that's been bugging me.",
    "Learned a new chord on the guitar.",
    "Made a stranger smile at the grocery store.",
    "Drank enough water today."
];

const mockGratitudes = [
    "Grateful for the quiet morning.",
    "Thankful for the sound of rain.",
    "Appreciated the taste of my favorite tea.",
    "Grateful for a cozy bed.",
    "Thankful for finding my lost keys.",
    "Appreciated a funny video that made me laugh.",
    "Grateful for my favorite song coming on shuffle.",
    "Thankful for the support of my family.",
    "Appreciated the sunset.",
    "Grateful for a productive day."
];

const generateMockLogs = (count: number): WinLog[] => {
  const logs: WinLog[] = [];
  const today = new Date(); // Use the actual current date
  let logCounter = 0;

  for (let i = 0; i < count; i++) {
    const date = subDays(today, i);
    const dateString = format(date, 'yyyy-MM-dd');

    // Skip creating logs for Dec 25th and 26th of the current year for demonstration
    if (dateString.endsWith('-12-25') || dateString.endsWith('-12-26')) {
      continue;
    }

    logs.push({
      id: `${i}`,
      win: mockWins[logCounter % mockWins.length],
      gratitude: mockGratitudes[logCounter % mockGratitudes.length],
      date: date.toISOString(),
    });
    logCounter++;
  }
  return logs;
};


export function GrowthHistory() {
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Use mock data for demonstration, generating data for the last 10 days
    const mockLogs = generateMockLogs(10);
    setLogs(mockLogs.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
    
    // Previous localStorage logic:
    // try {
    //   const savedLogs = localStorage.getItem('winbloom-logs');
    //   if (savedLogs) {
    //     setLogs(JSON.parse(savedLogs).sort((a: WinLog, b: WinLog) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
    //   }
    // } catch (error) {
    //   console.error("Failed to parse from localStorage", error);
    // }
  }, []);

  const groupedLogs = useMemo(() => {
    if (!isClient) return {};

    const groups: Record<string, WinLog[]> = {};
    logs.forEach(log => {
      const logDate = parseISO(log.date);
      const dateKey = format(logDate, 'yyyy-MM-dd');
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(log);
    });

    const today = startOfToday();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    const filledGroups: Record<string, WinLog[] | { empty: true; messageIndex: number; }> = {};
    if (logs.length > 0 || isClient) { // Ensure this runs even if logs are initially empty to show today's empty state
      let currentDate = today;
      // Go back a certain number of days to ensure we cover the test range
      const oldestDate = subDays(today, 12); 
      
      let emptyCounter = 0;
      while (currentDate >= oldestDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (groups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        } else {
            // Fill empty days within the range
            filledGroups[dateKey] = { empty: true, messageIndex: emptyCounter++ };
        }
        currentDate = subDays(currentDate, 1);
      }
      
      // Add any remaining older groups that might be outside the 12-day window
      Object.keys(groups).forEach(dateKey => {
        if (!filledGroups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        }
      });

    }

    // Create a sorted array of keys to ensure chronological order
    const sortedKeys = Object.keys(filledGroups).sort((a, b) => parseISO(b).getTime() - parseISO(a).getTime());
    
    const orderedFilledGroups: Record<string, WinLog[] | { empty: true; messageIndex: number; }> = {};
    sortedKeys.forEach(key => {
        orderedFilledGroups[key] = filledGroups[key] as WinLog[] | { empty: true; messageIndex: number; };
    });


    return orderedFilledGroups;

  }, [logs, isClient]);

  const getGroupTitle = (dateKey: string) => {
    const date = parseISO(dateKey);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, 'EEEE');
    return format(date, 'MMMM do');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline text-primary font-bold">Your Growth History</h2>
        <p className="text-muted-foreground">
          A log of your recent wins and gratitudes. You have a total of <span className="font-bold text-primary">{logs.length}</span> entries.
        </p>
      </div>

      <div className="space-y-8">
        {isClient && Object.keys(groupedLogs).length > 0 ? (
          Object.entries(groupedLogs).map(([dateKey, entries]) => (
            <div key={dateKey} className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold font-headline text-foreground/90">
                {getGroupTitle(dateKey)}
              </h3>
              
              {'empty' in entries ? (
                 <Card className="dark:border-[#485971] border-dashed dark:bg-card/50">
                    <CardContent className="p-6 text-center flex flex-col items-center gap-4">
                        <Leaf className="size-8 text-primary/50" />
                        <p className="text-muted-foreground italic">
                            {encouragingMessages[entries.messageIndex % encouragingMessages.length]}
                        </p>
                    </CardContent>
                 </Card>
              ) : (
                <div className="space-y-4">
                  {entries.map(log => (
                    <Card key={log.id} className="dark:border-[#485971] dark:bg-card/80">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                            <p>
                                <span className="font-bold text-card-foreground">🏆 Win of the Day:</span> {log.win}
                            </p>
                            <p className="text-sm">
                                <span className="font-bold italic text-muted-foreground">Grateful for...</span> <span className="italic text-muted-foreground">{log.gratitude}</span>
                            </p>
                        </div>
                        <p className="text-xs text-right mt-2 font-medium text-muted-foreground/80">
                          {format(new Date(log.date), "h:mm a")}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          isClient && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Leaf className="size-16 text-muted-foreground/50 mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No entries yet.</p>
              <p className="text-sm text-muted-foreground">Your history will appear here once you start logging.</p>
            </div>
          )
        )}

        {!isClient && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="size-8 animate-spin text-primary" />
            </div>
        )}
      </div>
    </div>
  );
}
