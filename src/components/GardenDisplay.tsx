
"use client";

import { Droplets, Sprout } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from './ui/progress';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useWindowSize } from '@react-hook/window-size';
import { ConfettiBurst } from './Confetti';

interface GardenDisplayProps {
    dewdrops: number;
    progressToNextFlower: number;
    currentProgressSteps: number;
    stepsForNextFlower: number;
    dewdropsForNextFlower: number;
    flowerCount: number;
    logCount: number;
}

export function GardenDisplay({
    dewdrops,
    progressToNextFlower,
    currentProgressSteps,
    stepsForNextFlower,
    dewdropsForNextFlower,
    flowerCount,
    logCount,
}: GardenDisplayProps) {
    const { theme } = useTheme();
    const { width = 0, height = 0 } = useWindowSize();
    
    // Confetti logic now depends on the dynamic flower cost
    const costOfCurrentFlower = dewdropsForNextFlower + (dewdrops % (stepsForNextFlower * 10));
    const showConfetti = dewdrops > 0 && flowerCount > 0 && dewdrops % costOfCurrentFlower === 0 && logCount > 0;
    
    return (
        <>
            {showConfetti && <ConfettiBurst />}
            <div className="space-y-6">
                <Card>
                    <CardHeader className="flex-row items-center justify-between pb-4">
                        <div className="space-y-1.5">
                            <CardTitle className="font-headline">Dewdrop Balance</CardTitle>
                            <CardDescription>Earn 10 Dewdrops for every win you log!</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 text-4xl font-bold text-primary dark:text-accent">
                            <Droplets className="size-8" />
                            <span>{dewdrops}</span>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 pt-2">
                            <div className="relative w-full h-8 flex items-center">
                                <Progress value={progressToNextFlower} className="h-2" indicatorClassName={theme === 'light' ? 'bg-[#3D8E73]' : ''} />
                                <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-between">
                                    {Array.from({ length: stepsForNextFlower }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-8 w-8 rounded-full flex items-center justify-center transition-colors duration-500",
                                                i < currentProgressSteps ? (theme === 'light' ? 'bg-[#3D8E73]' : 'bg-primary') : '',
                                            )}
                                            style={
                                                i >= currentProgressSteps
                                                    ? (i === (stepsForNextFlower - 1) ? { backgroundColor: '#121212' } : { backgroundColor: '#AAAAAA' })
                                                    : {}
                                            }
                                        >
                                            {i < (stepsForNextFlower - 1) ? (
                                                <Droplets className={cn("size-5", i < currentProgressSteps ? 'text-primary-foreground' : 'text-white')} />
                                            ) : (
                                                <span className={cn("text-2xl", i < currentProgressSteps ? '' : '')}>🌸</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <p className="text-sm font-medium text-muted-foreground pt-2 text-center">
                                Your progress to the next flower!
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="font-headline">Your Digital Garden</CardTitle>
                        <CardDescription>Watch your garden grow with every win you log.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col items-center justify-center p-4 md:p-6 bg-accent/10 rounded-b-lg border-2 border-dashed border-accent/30 dark:bg-card">
                        <div className="w-full flex flex-col items-center flex-grow">
                            <div className="flex flex-col items-center justify-center gap-4 text-center flex-grow">
                                {logCount === 0 ? (
                                    <>
                                        <Sprout className="text-accent" size={64} />
                                        <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs">
                                            Existing is a full-time job. Rest is productive, too.
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Sprout className="text-accent" size={80} />
                                        <p className="text-center text-lg italic font-medium text-muted-foreground max-w-xs mt-2">
                                            Just {dewdropsForNextFlower} more Dewdrops to go until your next flower!
                                        </p>
                                    </>
                                )}
                            </div>
                            {flowerCount > 0 && (
                                <>
                                    <div className="w-full border-t border-border my-4"></div>
                                    <p className="text-muted-foreground mb-4 font-headline text-lg">Your bloomed flowers</p>
                                    <div className="w-full flex flex-wrap justify-center gap-x-2 gap-y-4">
                                        {Array.from({ length: flowerCount }).map((_, i) => (
                                            <div key={i} className="flex justify-center">
                                                <span
                                                    className="text-4xl animate-bloom"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                >
                                                    🌸
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
