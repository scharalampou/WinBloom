
"use client";

import { useState } from 'react';
import { Sprout, History, Users, Plus } from 'lucide-react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WinForm } from './WinForm';
import { useToast } from '@/hooks/use-toast';
import type { WinLog } from '@/app/lib/types';


const wittyHeadlines = [
  "Adulting level: Expert. 🏆",
  "You’re winning at life today! ✨",
  "Basically an Olympic Legend now. 🥇",
  "Making moves and taking names! 🪴",
  "Achievement unlocked: Absolute Legend. 🙌",
];

export function BottomNav() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleWinLog = (win: string, gratitude: string) => {
    try {
      const savedLogs = localStorage.getItem('winbloom-logs') || '[]';
      const logs: WinLog[] = JSON.parse(savedLogs);
      const newLog: WinLog = { id: new Date().toISOString(), win, gratitude, date: new Date().toISOString() };
      const updatedLogs = [newLog, ...logs];
      localStorage.setItem('winbloom-logs', JSON.stringify(updatedLogs));

      const savedDewdrops = localStorage.getItem('winbloom-dewdrops') || '0';
      const dewdrops = JSON.parse(savedDewdrops);
      const newDewdrops = dewdrops + 10;
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(newDewdrops));

      const randomHeadline = wittyHeadlines[Math.floor(Math.random() * wittyHeadlines.length)];
      toast({
        className: "bg-primary text-primary-foreground border-none",
        title: <span className="font-bold">{randomHeadline}</span>,
        description: "Success! +10 Dewdrops added. Refresh to see your garden grow!",
        duration: 10000,
      });

    } catch (error) {
       console.error("Failed to save to localStorage", error);
       toast({ variant: 'destructive', title: 'Oh no!', description: 'Could not save your win.' });
    }
    
    setIsFormOpen(false);
  };


  return (
    <>
      <div className={cn(
        "fixed bottom-0 left-0 right-0 h-[calc(4.5rem+env(safe-area-inset-bottom))] bg-background/95 backdrop-blur-sm border-t",
        "flex sm:hidden", // visible on small screens, hidden on sm and up
        "justify-around pt-2 text-muted-foreground",
        "pb-[env(safe-area-inset-bottom)]"
      )}>
        <TabsList className="grid grid-cols-4 w-full h-full bg-transparent p-0">
          <TabsTrigger value="garden" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
            <Sprout className="size-6" />
            <span className="text-xs font-semibold">My Garden</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
            <History className="size-6" />
            <span className="text-xs font-semibold">My Growth</span>
          </TabsTrigger>
          <TabsTrigger value="global" className="flex-col h-full gap-1 data-[state=active]:text-white dark:data-[state=active]:text-[#121212] bg-transparent shadow-none border-none data-[state=active]:shadow-none data-[state=active]:rounded-none">
            <Users className="size-6" />
            <span className="text-xs font-semibold">Feed</span>
          </TabsTrigger>

          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <div className="flex flex-col items-center justify-center h-full gap-1 text-primary">
                    <Plus className="size-6" />
                    <span className="text-xs font-semibold">Log +</span>
                </div>
            </DialogTrigger>
            <DialogContent className="max-w-[420px]">
              <DialogHeader>
                <DialogTitle>Cultivate Your Day</DialogTitle>
              </DialogHeader>
              <WinForm onWinLog={handleWinLog} />
            </DialogContent>
          </Dialog>
        </TabsList>
      </div>
    </>
  );
}
