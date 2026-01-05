
"use client";

import { useState, useEffect, useMemo } from 'react';
import type { WinLog } from '@/app/lib/types';
import { Button } from './ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { History, Loader2, Trophy, Heart } from 'lucide-react';
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  parseISO,
  startOfToday,
  startOfYesterday,
  startOfWeek
} from 'date-fns';

const encouragingMessages = [
  "Even the earth needs a day of rest to bloom. See you tomorrow!",
  "No dewdrops today? Your garden is still rooting for you.",
  "Rest is productive, too. Your seedling is waiting whenever you are ready.",
  "Taking a break is part of the process. Breathe and be kind to yourself.",
  "Existing is a full-time job. You're doing great just being here.",
];

export function GrowthHistory() {
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs).sort((a: WinLog, b: WinLog) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
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
    const yesterday = startOfYesterday();
    const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });

    const filledGroups: Record<string, WinLog[] | { empty: true }> = {};
    if (logs.length > 0) {
      let currentDate = today;
      const oldestDate = parseISO(logs[logs.length - 1].date);
      
      while (currentDate >= oldestDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (groups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        } else if (isToday(currentDate) || isYesterday(currentDate) || currentDate >= startOfCurrentWeek) {
          filledGroups[dateKey] = { empty: true };
        }
        currentDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
      }
      
      // Add any remaining older groups
      Object.keys(groups).forEach(dateKey => {
        if (!filledGroups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        }
      });

    }

    return filledGroups;

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
          Object.entries(groupedLogs).map(([dateKey, entries], index) => (
            <div key={dateKey} className="space-y-4">
              <h3 className="text-xl md:text-2xl font-bold font-headline text-foreground/90">
                {getGroupTitle(dateKey)}
              </h3>
              
              {'empty' in entries ? (
                 <Card className="dark:border-border/20 border-dashed dark:bg-card/50">
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground italic">
                            {encouragingMessages[index % encouragingMessages.length]}
                        </p>
                    </CardContent>
                 </Card>
              ) : (
                <div className="space-y-4">
                  {entries.map(log => (
                    <Card key={log.id} className="dark:border-[#485971] dark:bg-card/80">
                      <CardContent className="p-4">
                        <div className="space-y-1">
                          <p className="font-bold text-card-foreground">{log.win}</p>
                          <p className="text-sm italic text-muted-foreground">
                            {log.gratitude}
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
              <History className="size-16 text-muted-foreground/50 mb-4" />
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
