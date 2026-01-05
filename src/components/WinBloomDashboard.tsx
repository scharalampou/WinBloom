
"use client";

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Droplets, Flower2, Loader2, Sparkles, Sprout, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getWinSuggestion } from '@/app/lib/actions';
import type { WinLog } from '@/app/lib/types';
import { cn, format } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

const formSchema = z.object({
  win: z.string().min(3, "Your win needs a bit more detail!"),
  gratitude: z.string().min(3, "Please share a little more about your gratitude."),
});

const flowerPositions = [
  { top: '25%', left: '20%', size: 28 }, { top: '30%', right: '15%', size: 32 },
  { top: '55%', left: '10%', size: 36 }, { top: '65%', right: '25%', size: 24 },
  { top: '80%', left: '35%', size: 40 }, { top: '15%', left: '50%', size: 26 },
  { top: '45%', right: '40%', size: 30 }, { top: '75%', right: '5%', size: 34 },
  { top: '10%', right: '25%', size: 28 }, { top: '90%', left: '5%', size: 38 },
];

export function WinBloomDashboard() {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [lastFlowerToast, setLastFlowerToast] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { win: "", gratitude: "" },
  });

  useEffect(() => {
    setIsClient(true);
    try {
      const savedDewdrops = localStorage.getItem('winbloom-dewdrops');
      const savedLogs = localStorage.getItem('winbloom-logs');
      if (savedDewdrops) {
        const parsedDewdrops = JSON.parse(savedDewdrops);
        setDewdrops(parsedDewdrops);
        setLastFlowerToast(Math.floor(parsedDewdrops / 50) * 50);
      }
      if (savedLogs) setLogs(JSON.parse(savedLogs));
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('winbloom-dewdrops', JSON.stringify(dewdrops));
      const newFlowerMilestone = Math.floor(dewdrops / 50) * 50;
      if (dewdrops > 0 && newFlowerMilestone > lastFlowerToast && newFlowerMilestone > 0) {
        toast({
            title: 'A new flower has bloomed!',
            description: 'Your garden is flourishing!',
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
  
  const flowerCount = useMemo(() => isClient ? Math.min(Math.floor(dewdrops / 50), flowerPositions.length) : 0, [dewdrops, isClient]);
  const dewdropsForNextFlower = useMemo(() => 50 - (dewdrops % 50), [dewdrops]);

  const handleShuffle = () => {
    startTransition(async () => {
      const result = await getWinSuggestion();
      if (result.suggestion) {
        // Decide randomly to fill 'win' or 'gratitude' field
        if (Math.random() > 0.5) {
            form.setValue('win', result.suggestion, { shouldValidate: true });
        } else {
            form.setValue('gratitude', result.suggestion, { shouldValidate: true });
        }
      } else {
        toast({
          variant: 'destructive',
          title: 'Oh no!',
          description: result.error,
        });
      }
    });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newLog: WinLog = {
      id: new Date().toISOString(),
      win: values.win,
      gratitude: values.gratitude,
      date: new Date().toISOString(),
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
    setDewdrops(prevDewdrops => prevDewdrops + 10);
    form.reset();
    toast({
      title: 'Look at you adulting like a pro!',
      description: 'You\'ve earned 10 dewdrops!',
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
       <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <div className="space-y-1.5">
              <CardTitle className="font-headline">Dewdrop Balance</CardTitle>
              <CardDescription>Earn 10 for each entry.</CardDescription>
            </div>
            <div className="flex items-center gap-2 text-4xl font-bold text-primary">
              <Droplets className="size-8" />
              <span>{isClient ? dewdrops : 0}</span>
            </div>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Cultivate Your Day</CardTitle>
            <CardDescription>Log a win and something you're grateful for.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="win"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel className="font-bold">Today's Win</FormLabel>
                      </div>
                      <FormControl>
                        <Textarea placeholder="Found matching socks..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gratitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold">Today's Gratitude</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Grateful for the morning coffee..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-2">
                <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-bold" disabled={!form.formState.isValid}>Log Your Growth</Button>
                <Button type="button" size="sm" onClick={handleShuffle} disabled={isPending} aria-label="Suggest a win" className="bg-accent text-accent-foreground hover:bg-accent/90">
                  {isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="h-4 w-4" />
                  )}
                  <span className="ml-2">Suggestions...</span>
                </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Growth History</CardTitle>
            <CardDescription>A log of your recent wins and gratitudes.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64">
              <div className="space-y-4 pr-4">
                {isClient && logs.length > 0 ? (
                  logs.map(log => (
                    <div key={log.id} className="p-3 rounded-md border bg-muted/50">
                      <p className="text-sm font-semibold flex items-center gap-2">
                        <Sparkles className="size-4 text-accent" /> Win: <span className="font-normal text-muted-foreground">{log.win}</span>
                      </p>
                       <p className="text-sm font-semibold flex items-center gap-2 mt-1">
                        <Flower2 className="size-4 text-primary" /> Gratitude: <span className="font-normal text-muted-foreground">{log.gratitude}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">{format(new Date(log.date), "PPP")}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-10">
                    Your history will appear here once you start logging.
                  </p>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card className="lg:col-span-3 aspect-square lg:aspect-auto flex flex-col">
        <CardHeader>
          <CardTitle className="font-headline">Your Digital Garden</CardTitle>
          <CardDescription>Watch your garden grow with every win you log.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center relative bg-muted/30 rounded-lg overflow-hidden">
          {isClient ? (
            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="relative">
                <Sprout className="text-primary/70" size={64} style={{ zIndex: flowerPositions.length + 1 }}/>
                {Array.from({ length: flowerCount }).map((_, i) => {
                  const pos = flowerPositions[i % flowerPositions.length];
                  return (
                    <Flower2
                      key={i}
                      className="text-primary absolute animate-bloom"
                      size={pos.size}
                      style={{ ...pos, animationDelay: `${i * 100}ms` }}
                    />
                  )
                })}
              </div>
               {logs.length > 0 ? (
                <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs">
                  Just {dewdropsForNextFlower} more Dewdrops to go until your next flower!
                </p>
              ) : (
                <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs">
                  Existing is a full-time job. Rest is productive, too.
                </p>
              )}
            </div>
          ) : <Loader2 className="animate-spin text-primary" />}
        </CardContent>
      </Card>
    </div>
  );
}
