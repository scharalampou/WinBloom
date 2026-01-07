
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

const LEVEL_CONFIG = [
  { flowers: 3, cost: 30 }, // 1-3
  { flowers: 3, cost: 40 }, // 4-6
  { flowers: 3, cost: 50 }, // 7-9
  { flowers: 3, cost: 60 }, // 10-12
];
const MAX_COST = 70;

const calculateFlowerGrowth = (dewdrops: number) => {
  let flowerCount = 0;
  let remainingDewdrops = dewdrops;
  let costForNextFlower = LEVEL_CONFIG[0].cost;

  for (const level of LEVEL_CONFIG) {
    const dewdropsForLevel = level.flowers * level.cost;
    if (remainingDewdrops >= dewdropsForLevel) {
      remainingDewdrops -= dewdropsForLevel;
      flowerCount += level.flowers;
    } else {
      const flowersInLevel = Math.floor(remainingDewdrops / level.cost);
      flowerCount += flowersInLevel;
      remainingDewdrops -= flowersInLevel * level.cost;
      costForNextFlower = level.cost;
      break;
    }
    costForNextFlower = LEVEL_CONFIG[LEVEL_CONFIG.indexOf(level) + 1]?.cost ?? MAX_COST;
  }
  
  if (remainingDewdrops >= costForNextFlower) {
      const flowersInMaxLevel = Math.floor(remainingDewdrops / MAX_COST);
      flowerCount += flowersInMaxLevel;
      remainingDewdrops -= flowersInMaxLevel * MAX_COST;
      costForNextFlower = MAX_COST;
  }

  const dewdropsForNextFlower = costForNextFlower - remainingDewdrops;
  const progressToNextFlower = (remainingDewdrops / costForNextFlower) * 100;
  const currentProgressSteps = Math.floor(remainingDewdrops / 10);
  const stepsForNextFlower = Math.ceil(costForNextFlower / 10);
  
  return {
    flowerCount,
    dewdropsForNextFlower,
    progressToNextFlower,
    currentProgressSteps,
    stepsForNextFlower,
  };
};

export function WinBloomDashboard() {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [lastFlowerToastCount, setLastFlowerToastCount] = useState(0);

  const {
    flowerCount,
    dewdropsForNextFlower,
    progressToNextFlower,
    currentProgressSteps,
    stepsForNextFlower
  } = useMemo(() => isClient ? calculateFlowerGrowth(dewdrops) : {
    flowerCount: 0, dewdropsForNextFlower: 30, progressToNextFlower: 0, currentProgressSteps: 0, stepsForNextFlower: 3
  }, [dewdrops, isClient]);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedDewdrops = localStorage.getItem('winbloom-dewdrops');
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedDewdrops) {
        const parsedDewdrops = JSON.parse(savedDewdrops);
        setDewdrops(parsedDewdrops);
        const initialGrowth = calculateFlowerGrowth(parsedDewdrops);
        setLastFlowerToastCount(initialGrowth.flowerCount);
      }
      if (savedLogs) setLogs(JSON.parse(savedLogs));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(dewdrops));
      if (flowerCount > lastFlowerToastCount) {
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
        setLastFlowerToastCount(flowerCount);
      }
    }
  }, [dewdrops, isClient, toast, flowerCount, lastFlowerToastCount]);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-logs', JSON.stringify(logs));
    }
  }, [logs, isClient]);
  
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
            stepsForNextFlower={stepsForNextFlower}
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
