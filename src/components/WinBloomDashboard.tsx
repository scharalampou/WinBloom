
"use client";

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Award, Droplets, Flower2, Loader2, Sparkles, Sprout, Wand2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getWinSuggestion } from '@/app/lib/actions';
import type { WinLog } from '@/app/lib/types';
import { cn, format } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { DailyInspiration } from './DailyInspiration';
import { Progress } from './ui/progress';

const formSchema = z.object({
  win: z.string().min(3, "Your win needs a bit more detail!"),
  gratitude: z.string().min(3, "Please share a little more about your gratitude."),
});

const flowerColors = [
  "text-pink-500", "text-rose-500", "text-red-500", "text-orange-500",
  "text-yellow-400", "text-lime-400", "text-green-500", "text-emerald-500",
  "text-teal-500", "text-cyan-500", "text-sky-500", "text-blue-500",
  "text-indigo-500", "text-violet-500", "text-purple-500", "text-fuchsia-500",
];

type SuggestionField = 'win' | 'gratitude';

export function WinBloomDashboard() {
  const [dewdrops, setDewdrops] = useState<number>(0);
  const [logs, setLogs] = useState<WinLog[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [lastFlowerToast, setLastFlowerToast] = useState(0);
  const [suggestionTarget, setSuggestionTarget] = useState<SuggestionField | null>(null);

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
  
  const flowerCount = useMemo(() => isClient ? Math.floor(dewdrops / 50) : 0, [dewdrops, isClient]);
  const dewdropsForNextFlower = useMemo(() => 50 - (dewdrops % 50), [dewdrops]);
  const progressToNextFlower = useMemo(() => (50 - dewdropsForNextFlower) / 50 * 100, [dewdropsForNextFlower]);

  const handleShuffle = (field: SuggestionField) => {
    setSuggestionTarget(field);
    startTransition(async () => {
      const result = await getWinSuggestion();
      if (result.suggestion) {
        form.setValue(field, result.suggestion, { shouldValidate: true });
      } else {
        toast({
          variant: 'destructive',
          title: 'Oh no!',
          description: result.error,
        });
      }
      setSuggestionTarget(null);
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
    <div className="space-y-6">
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
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleShuffle('win')} disabled={isPending} aria-label="Suggest a win">
                            {isPending && suggestionTarget === 'win' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Wand2 className="h-4 w-4 text-accent" />
                            )}
                            <span className="ml-2 hidden sm:inline">Suggest</span>
                          </Button>
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
                         <div className="flex justify-between items-center">
                          <FormLabel className="font-bold">Today's Gratitude</FormLabel>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleShuffle('gratitude')} disabled={isPending} aria-label="Suggest a gratitude">
                            {isPending && suggestionTarget === 'gratitude' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Wand2 className="h-4 w-4 text-accent" />
                            )}
                            <span className="ml-2 hidden sm:inline">Suggest</span>
                          </Button>
                        </div>
                        <FormControl>
                          <Textarea placeholder="Grateful for the morning coffee..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button type="submit" className="w-full bg-black text-white hover:bg-black/80 font-bold" disabled={!form.formState.isValid}>Log Your Growth</Button>
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
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Your Digital Garden</CardTitle>
            <CardDescription>Watch your garden grow with every win you log.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-start p-4 md:p-6 bg-muted/30 rounded-b-lg flex-grow">
            {!isClient ? (
              <div className="flex items-center justify-center flex-grow">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center">
                
                {/* Currently Growing Section */}
                <div className="flex flex-col items-center justify-center gap-4 text-center mb-8">
                  {logs.length === 0 ? (
                    <>
                      <Sprout className="text-primary/70" size={64} />
                      <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs">
                        Existing is a full-time job. Rest is productive, too.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <Sprout className="text-primary/30" size={80} />
                        <div 
                          className="absolute bottom-0 left-0 right-0 overflow-hidden"
                          style={{ height: `${progressToNextFlower}%`}}
                        >
                          <Sprout className="text-primary" size={80} />
                        </div>
                      </div>
                       <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs mt-2">
                        Just {dewdropsForNextFlower} more Dewdrops to go until your next flower!
                      </p>
                      <Progress value={progressToNextFlower} className="w-48 h-2 mt-2" />
                    </>
                  )}
                </div>

                {/* Separator and Bloomed Flowers Grid */}
                {flowerCount > 0 && (
                  <>
                    <div className="w-full border-t border-border my-4"></div>
                    <p className="text-muted-foreground mb-4 font-headline text-lg">Your bloomed flowers</p>
                    <div className="w-full grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-y-4 gap-x-2 items-center justify-center">
                      {Array.from({ length: flowerCount }).map((_, i) => (
                        <div key={i} className="flex justify-center">
                          <Flower2
                            className={cn("animate-bloom", flowerColors[i % flowerColors.length])}
                            style={{ animationDelay: `${i * 100}ms` }}
                            size={40}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <DailyInspiration />
    </div>
  );

    