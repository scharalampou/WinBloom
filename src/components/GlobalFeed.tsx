"use client";

import { exampleWins, type ExampleWin } from '@/app/lib/mock-data';
import { quotes, type Quote } from '@/app/lib/quotes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Sprout } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type FeedItem = (ExampleWin & { type: 'win' }) | (Quote & { type: 'quote' });

const inspirationColors = [
  'bg-[hsl(var(--inspiration-1))]',
  'bg-[hsl(var(--inspiration-2))]',
  'bg-[hsl(var(--inspiration-3))]',
  'bg-[hsl(var(--inspiration-4))]',
];

export function GlobalFeed() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const mixedFeed = useMemo((): FeedItem[] => {
    if (!isClient) return [];
    
    const feed: FeedItem[] = [];
    const wins = [...exampleWins].map(win => ({ ...win, type: 'win' as const }));
    const shuffledQuotes = [...quotes].sort(() => 0.5 - Math.random());
    
    let winIndex = 0;
    let quoteIndex = 0;

    // Start with a quote
    feed.push({ ...shuffledQuotes[quoteIndex++], type: 'quote' });

    while (winIndex < wins.length) {
      const winsToAdd = Math.floor(Math.random() * 2) + 3; // 3 or 4
      feed.push(...wins.slice(winIndex, winIndex + winsToAdd));
      winIndex += winsToAdd;

      if (quoteIndex < shuffledQuotes.length) {
        feed.push({ ...shuffledQuotes[quoteIndex++], type: 'quote' });
      }
    }
    
    return feed;
  }, [isClient]);

  const [dailySpotlight, ...masonryItems] = mixedFeed;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl font-headline text-primary font-bold dark:text-accent">Community Feed</h2>
        <p className="text-muted-foreground">
          Get inspired by small and big wins from the WinBloom community around the world.
        </p>
      </div>

      {isClient && dailySpotlight && (
        <Card className="col-span-full relative overflow-hidden rounded-lg shadow-lg">
          <Image
              src="https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop"
              alt="Misty forest"
              fill
              className="object-cover"
              data-ai-hint="misty forest"
            />
          <div className="absolute inset-0 bg-black/50" />
          <CardHeader className="relative z-10 text-white">
            <CardTitle className="font-headline text-lg font-bold">Daily Spotlight</CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-white min-h-[150px] flex items-center justify-center">
            {dailySpotlight.type === 'quote' ? (
              <figure className="text-center p-4">
                <blockquote className="font-sketch text-2xl md:text-3xl font-normal italic">
                  “{dailySpotlight.quote}”
                </blockquote>
                <figcaption className="text-center text-lg mt-4 font-medium opacity-90">— {dailySpotlight.source}</figcaption>
              </figure>
            ) : (
              <p className="text-xl md:text-2xl italic">"{dailySpotlight.win}"</p>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {isClient && masonryItems.map((item, index) => {
          if (item.type === 'win') {
            return (
              <Card key={`win-${index}`} className="break-inside-avoid flex flex-col transition-transform duration-300 hover:-translate-y-1 border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="bg-secondary p-2 rounded-full text-xl dark:bg-primary/10">
                      <Sprout className="text-primary dark:text-accent" />
                    </span>
                    <span className="text-base font-body pt-1 font-medium text-muted-foreground">{item.user}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-card-foreground italic">"{item.win}"</p>
                </CardContent>
                <CardFooter>
                  <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                    <span className="text-accent/80">🌸</span>
                    <span>{item.flowers} flowers bloomed</span>
                  </div>
                </CardFooter>
              </Card>
            );
          } else { // item.type === 'quote'
            const colorClass = inspirationColors[index % inspirationColors.length];
            return (
              <Card key={`quote-${index}`} className={cn("break-inside-avoid transition-transform duration-300 hover:-translate-y-1 border-0", colorClass)}>
                <CardContent className="p-6 h-full flex items-center justify-center">
                   <figure className="text-center">
                    <blockquote className="font-sketch text-xl md:text-2xl font-normal italic text-foreground/80">
                      “{item.quote}”
                    </blockquote>
                    <figcaption className="text-center text-sm mt-2 font-medium opacity-70">— {item.source}</figcaption>
                  </figure>
                </CardContent>
              </Card>
            );
          }
        })}
      </div>
    </div>
  );
}
