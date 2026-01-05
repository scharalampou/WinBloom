
"use client";

import { exampleWins } from '@/app/lib/mock-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Award, Flower } from 'lucide-react';
import { useEffect, useState } from 'react';

export function GlobalFeed() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-3xl font-headline text-primary">Community Garden</h2>
        <p className="text-muted-foreground">
          Get inspired by small and big wins from the WinBloom community around the world.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {isClient && exampleWins.map((item, index) => (
          <Card key={index} className="flex flex-col transition-transform duration-300 hover:-translate-y-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <span className="bg-secondary p-2 rounded-full">
                  <Award className="text-accent" size={20} />
                </span>
                <span className="text-base font-body pt-1 font-medium text-muted-foreground">{item.user}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-card-foreground italic">"{item.win}"</p>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground font-medium flex items-center gap-2">
                <Flower className="text-accent/80" size={16} />
                <span>{item.flowers} flowers bloomed</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
