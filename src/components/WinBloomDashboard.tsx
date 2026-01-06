
"use client";

import { useState, useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import type { WinLog } from '@/app/lib/types';
import { WinForm } from './WinForm';
import { GardenDisplay } from './GardenDisplay';
import { useToast } from '@/hooks/use-toast';
import { Sprout } from 'lucide-react';


const wittyHeadlines = [
  "Adulting level: Expert. 🏆",
  "You’re winning at life today! ✨",
  "Basically an Olympic Legend now. 🥇",
  "Making moves and taking names! 🪴",
  "Achievement unlocked: Absolute Legend. 🙌",
  "Not saying you're a hero, but... 🦸‍♂️",
  "That win was elite. Seriously. 🔥",
  "You're doing the thing! Keep going. 🚀",
];

export function WinBloomDashboard() {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [lastFlowerToast, setLastFlowerToast] = useState(0);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedDewdrops = localStorage.getItem('winbloom-dewdrops');
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedDewdrops) {
        const parsedDewdrops = JSON.parse(savedDewdrops);
        setDewdrops(parsedDewdrops);
        setLastFlowerToast(Math.floor(parsedDewdrops / 70) * 70);
      }
      if (savedLogs) setLogs(JSON.parse(savedLogs));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(dewdrops));
      const newFlowerMilestone = Math.floor(dewdrops / 70) * 70;
      if (dewdrops > 0 && newFlowerMilestone > lastFlowerToast && newFlowerMilestone > 0) {
        toast({
          className: "bg-primary text-primary-foreground border-none",
          title: (
            <div className="flex items-center gap-2 font-bold text-primary-foreground">
              <Sprout className="text-white" />
              <span>A new flower has bloomed! 🌸</span>
            </div>
          ),
          description: "Your garden is flourishing!",
          duration: 10000,
        });
        setLastFlowerToast(newFlowerMilestone);
      }
    }
  }, [dewdrops, isClient, toast, lastFlowerToast]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-logs', JSON.stringify(logs));
    }
  }, [logs, isClient]);
  
  const flowerCount = useMemo(() => isClient ? Math.floor(dewdrops / 70) : 0, [dewdrops, isClient]);
  const dewdropsForNextFlower = useMemo(() => 70 - (dewdrops % 70), [dewdrops]);
  const progressToNextFlower = useMemo(() => (70 - dewdropsForNextFlower) / 70 * 100, [dewdropsForNextFlower]);
  const currentProgressSteps = useMemo(() => isClient ? Math.floor((dewdrops % 70) / 10) : 0, [dewdrops, isClient]);

  const handleWinLog = (win: string, gratitude: string) => {
    const newLog: WinLog = {
      id: new Date().toISOString(),
      win,
      gratitude,
      date: new Date().toISOString(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
    setDewdrops(prevDewdrops => prevDewdrops + 10);
    
    const randomHeadline = wittyHeadlines[Math.floor(Math.random() * wittyHeadlines.length)];

    toast({
      className: "bg-primary text-primary-foreground border-none",
      title: <span className="font-bold">{randomHeadline}</span>,
      description: "Success! +10 Dewdrops added to your balance.",
      duration: 10000,
    });
  };

  if (!isClient) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <GardenDisplay 
            dewdrops={dewdrops}
            progressToNextFlower={progressToNextFlower}
            currentProgressSteps={currentProgressSteps}
            dewdropsForNextFlower={dewdropsForNextFlower}
            flowerCount={flowerCount}
            logCount={logs.length}
          />
        </div>
        <div className="lg:col-span-2 space-y-6 hidden sm:block">
           <WinForm onWinLog={handleWinLog} />
        </div>
      </div>
    </div>
  );
}
