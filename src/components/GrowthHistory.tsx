
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Loader2, Trophy, Heart } from 'lucide-react';
import { format } from '@/lib/utils';
import type { WinLog } from '@/app/lib/types';
import { Button } from './ui/button';

const ITEMS_PER_PAGE = 10;

export function GrowthHistory() {
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isClient, setIsClient] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedLogs) {
        setLogs(JSON.parse(savedLogs));
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    // Simulate a network request
    setTimeout(() => {
      setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 500);
  };
  
  const visibleLogs = logs.slice(0, visibleCount);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-headline text-primary font-bold">Your Growth History</h2>
        <p className="text-muted-foreground">
          A log of your recent wins and gratitudes. You have a total of <span className="font-bold text-primary">{logs.length}</span> entries.
        </p>
      </div>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="space-y-4 pr-4">
            {isClient && logs.length > 0 ? (
              visibleLogs.map(log => (
                <div key={log.id} className="p-4 rounded-lg border bg-slate-50 dark:bg-card text-card-foreground">
                  <div className="space-y-2">
                    <p className="text-sm flex items-start gap-2">
                      <Trophy className="h-5 w-5 text-emerald-600 dark:text-primary mt-0.5 shrink-0" />
                      <span className="flex-1"><span className="font-semibold text-emerald-600 dark:text-primary">Win: </span>{log.win}</span>
                    </p>
                    <p className="text-sm flex items-start gap-2">
                      <Heart className="h-5 w-5 text-primary dark:text-accent mt-0.5 shrink-0" />
                      <span className="flex-1"><span className="font-semibold text-primary dark:text-accent">Gratitude: </span>{log.gratitude}</span>
                    </p>
                  </div>
                  <p className="text-xs text-right mt-3 font-medium text-muted-foreground">{format(new Date(log.date), "PPP")}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <History className="size-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No entries yet.</p>
                <p className="text-sm text-muted-foreground">Your history will appear here once you start logging.</p>
              </div>
            )}
          </div>
          {isClient && logs.length > visibleCount && (
            <div className="mt-6 text-center">
              <Button onClick={handleLoadMore} disabled={isLoadingMore} className="font-semibold">
                {isLoadingMore ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <History className="mr-2 h-4 w-4" />
                )}
                {isLoadingMore ? 'Loading...' : 'Load More Entries'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
