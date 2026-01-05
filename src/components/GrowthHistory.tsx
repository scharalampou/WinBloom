
"use client";

import { useState, useEffect, useMemo, useTransition } from 'react';
import type { WinLog } from '@/app/lib/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Leaf } from 'lucide-react';
import {
  format,
  isToday,
  isYesterday,
  isThisWeek,
  parseISO,
  subDays,
  startOfToday,
} from 'date-fns';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

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
  const today = new Date();
  let logCounter = 0;
  let dewdrops = 0;
  let lastFlowerBloomDewdrops = 0;

  const tempLogs: WinLog[] = [];

  for (let i = count - 1; i >= 0; i--) {
      const date = subDays(today, i);
      const dateString = format(date, 'yyyy-MM-dd');

      if (dateString.endsWith('-12-25') || dateString.endsWith('-12-26')) {
        continue;
      }

      dewdrops += 10;
      let flowerBloomed = false;
      if (dewdrops > lastFlowerBloomDewdrops && dewdrops % 70 === 0) {
        flowerBloomed = true;
        lastFlowerBloomDewdrops = dewdrops;
      }

      tempLogs.push({
        id: `${i}`,
        win: mockWins[logCounter % mockWins.length],
        gratitude: mockGratitudes[logCounter % mockGratitudes.length],
        date: date.toISOString(),
        flowerBloomed,
      });
      logCounter++;
  }
  
  return tempLogs.reverse();
};


export function GrowthHistory() {
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [visibleDays, setVisibleDays] = useState(7);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setIsClient(true);
    const mockLogs = generateMockLogs(30); // Generate more logs for lazy loading
    setLogs(mockLogs.sort((a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()));
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

    const filledGroups: Record<string, WinLog[] | { empty: true; messageIndex: number; }> = {};
    if (logs.length > 0 || isClient) {
      let currentDate = today;
      const oldestDate = logs.length > 0 ? parseISO(logs[logs.length-1].date) : subDays(today, 29); 
      
      let emptyCounter = 0;
      while (currentDate >= oldestDate) {
        const dateKey = format(currentDate, 'yyyy-MM-dd');
        if (groups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        } else {
            filledGroups[dateKey] = { empty: true, messageIndex: emptyCounter++ };
        }
        currentDate = subDays(currentDate, 1);
      }
      
      Object.keys(groups).forEach(dateKey => {
        if (!filledGroups[dateKey]) {
          filledGroups[dateKey] = groups[dateKey];
        }
      });
    }

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

  const handleLoadMore = () => {
    startTransition(() => {
      setVisibleDays(prev => prev + 7);
    });
  };

  const dayEntries = useMemo(() => Object.entries(groupedLogs), [groupedLogs]);
  const visibleDayEntries = useMemo(() => dayEntries.slice(0, visibleDays), [dayEntries, visibleDays]);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline text-primary font-bold">Your Growth History</h2>
        <p className="text-muted-foreground">
          A log of your recent wins and gratitudes. You have a total of <span className="font-bold text-primary">{logs.length}</span> entries.
        </p>
      </div>

      <div className="space-y-8">
        {isClient && visibleDayEntries.length > 0 ? (
          visibleDayEntries.map(([dateKey, entries]) => (
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
                      <CardContent className="p-4 pb-2">
                        <div className="space-y-2">
                            <p>
                                <span className="font-bold text-card-foreground">🏆 Win of the Day:</span> {log.win}
                            </p>
                            <p className="text-sm">
                                <span className="font-bold italic text-muted-foreground">Grateful for...</span> <span className="italic text-muted-foreground">{log.gratitude}</span>
                            </p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between items-end p-4 pt-0">
                        {log.flowerBloomed ? (
                            <Badge variant="secondary" className="bg-accent/20 text-accent-foreground dark:text-accent border-accent/30 font-bold">
                                🌸 A flower bloomed today!
                            </Badge>
                        ) : (
                          <div></div> // Empty div to keep alignment
                        )}
                        <p className="text-xs text-right font-medium text-muted-foreground/80">
                          {format(new Date(log.date), "h:mm a")}
                        </p>
                      </CardFooter>
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

        {isClient && dayEntries.length > visibleDays && (
          <div className="text-center">
            <Button onClick={handleLoadMore} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load more entries'
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
