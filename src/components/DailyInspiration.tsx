"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { quotes, type Quote } from '@/app/lib/quotes';

export function DailyInspiration() {
  const [quote, setQuote] = useState<Quote | null>(null);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  };

  useEffect(() => {
    // Select a random quote only on the client-side to avoid hydration mismatch
    getRandomQuote();
  }, []);

  return (
    <Card className="text-primary-foreground border-none bg-gradient-to-r from-primary to-accent">
      <CardContent className="p-4 relative text-center">
        <div className="text-center">
          <p className="font-headline text-lg mb-2 font-bold">Daily Inspiration</p>
          {quote ? (
            <figure>
              <blockquote className="italic text-base">
                “{quote.quote}”
              </blockquote>
              <figcaption className="text-center text-sm mt-2 font-medium opacity-90">— {quote.source}</figcaption>
            </figure>
          ) : (
            <blockquote className="italic text-base">
              Loading your daily dose of inspiration...
            </blockquote>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={getRandomQuote}
          className="absolute top-4 right-4 text-primary-foreground hover:bg-white/20 hover:text-white shrink-0"
          aria-label="Refresh Quote"
        >
          <RefreshCw className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}
