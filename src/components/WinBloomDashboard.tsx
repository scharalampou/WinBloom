
"use client";

import { useState, useEffect, useTransition, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Award, Droplets, Flower, Loader2, Sparkles, Sprout } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getWinSuggestion } from '@/app/lib/actions';
import type { WinLog } from '@/app/lib/types';
import { cn, format } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { Progress } from './ui/progress';
import { DailyInspiration } from './DailyInspiration';

const formSchema = z.object({
  win: z.string().min(3, "Your win needs a bit more detail!"),
  gratitude: z.string().min(3, "Please share a little more about your gratitude."),
});

type SuggestionField = 'win' | 'gratitude';

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
    
    const randomHeadline = wittyHeadlines[Math.floor(Math.random() * wittyHeadlines.length)];

    toast({
      className: "bg-primary text-primary-foreground border-none",
      title: <span className="font-bold">{randomHeadline}</span>,
      description: "Success! +10 Dewdrops added to your balance.",
      duration: 10000,
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
                <CardDescription>Earn 10 Dewdrops every time you Log your Growth!</CardDescription>
              </div>
              <div className="flex items-center gap-2 text-4xl font-bold text-accent">
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
                          <FormLabel className="flex items-center gap-2 font-bold text-sm md:text-base">
                            <Sparkles className="text-accent" />
                            Today's Win
                          </FormLabel>
                          <Button 
                            type="button" 
                            onClick={() => handleShuffle('win')} 
                            disabled={isPending} 
                            aria-label="Suggest a win"
                            className="h-9 px-3 rounded-md border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground group"
                          >
                            {isPending && suggestionTarget === 'win' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                            )}
                            <span className="ml-1 hidden sm:inline">Suggest</span>
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
                          <FormLabel className="flex items-center gap-2 font-bold text-sm md:text-base">
                            <Flower className="text-primary" />
                            Today's Gratitude
                          </FormLabel>
                          <Button 
                            type="button" 
                            onClick={() => handleShuffle('gratitude')} 
                            disabled={isPending} 
                            aria-label="Suggest a gratitude"
                            className="h-9 px-3 rounded-md border border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground group"
                          >
                            {isPending && suggestionTarget === 'gratitude' ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Sparkles className="h-4 w-4 text-primary group-hover:text-primary-foreground" />
                            )}
                            <span className="ml-1 hidden sm:inline">Suggest</span>
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
                    <Button type="submit" className="w-full font-bold bg-primary text-primary-foreground hover:bg-primary/90" disabled={!form.formState.isValid}>Log Your Growth</Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline">Your Digital Garden</CardTitle>
            <CardDescription>Watch your garden grow with every win you log.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 bg-muted/30 rounded-b-lg">
            {!isClient ? (
              <div className="flex items-center justify-center flex-grow">
                <Loader2 className="animate-spin text-primary" />
              </div>
            ) : (
              <div className="w-full flex flex-col items-center flex-grow">
                
                <div className="flex flex-col items-center justify-center gap-4 text-center flex-grow">
                  {logs.length === 0 ? (
                    <>
                      <Sprout className="text-primary/70" size={64} />
                      <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs">
                        Existing is a full-time job. Rest is productive, too.
                      </p>
                    </>
                  ) : (
                    <>
                      <Sprout className="text-primary" size={80} />
                       <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs mt-2">
                        Just {dewdropsForNextFlower} more Dewdrops to go until your next flower!
                      </p>
                      <Progress value={progressToNextFlower} className="w-48 h-2 mt-2" />
                    </>
                  )}
                </div>

                {flowerCount > 0 && (
                  <>
                    <div className="w-full border-t border-border my-4"></div>
                    <p className="text-muted-foreground mb-4 font-headline text-lg">Your bloomed flowers</p>
                    <div className="w-full grid grid-cols-7 gap-y-4 gap-x-2 items-center justify-center">
                      {Array.from({ length: flowerCount }).map((_, i) => (
                        <div key={i} className="flex justify-center">
                          <Flower
                            className="animate-bloom text-accent"
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
    </div>
  );
}

    