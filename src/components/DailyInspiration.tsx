
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
    <Card className="bg-violet-500 text-white">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-grow">
            <p className="font-headline text-lg mb-2">Daily Inspiration</p>
            {quote ? (
              <figure>
                <blockquote className="italic text-base">
                  “{quote.quote}”
                </blockquote>
                <figcaption className="text-right text-sm mt-2 font-medium">— {quote.source}</figcaption>
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
            className="text-white hover:bg-white/20 hover:text-white shrink-0"
            aria-label="Refresh Quote"
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
