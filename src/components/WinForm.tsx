
"use client";

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getWinSuggestion } from '@/app/lib/actions';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  win: z.string().min(3, "Your win needs at least 3 characters.").max(100, "Keep your win concise!"),
  gratitude: z.string().min(3, "Gratitude needs at least 3 characters.").max(100, "Keep your gratitude concise!"),
});

type SuggestionField = 'win' | 'gratitude';

interface WinFormProps {
    onWinLog: (win: string, gratitude: string) => void;
}

export function WinForm({ onWinLog }: WinFormProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestionTarget, setSuggestionTarget] = useState<SuggestionField | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { win: "", gratitude: "" },
  });

  const winValue = form.watch('win');
  const gratitudeValue = form.watch('gratitude');

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

  const handleClear = (field: "win" | "gratitude") => {
    form.setValue(field, "", { shouldValidate: true });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    onWinLog(values.win, values.gratitude);
    form.reset();
  }

  return (
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
                    <FormLabel className="flex items-center gap-2 font-semibold text-sm md:text-base">
                      <span>🏆</span>
                      Today's Win
                    </FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleShuffle('win')}
                      disabled={isPending}
                      aria-label="Suggest a win"
                      className="h-9 px-3 rounded-md border-none bg-[#EA3E7D] text-white hover:bg-[#EA3E7D]/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                    >
                      {isPending && suggestionTarget === 'win' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-white dark:text-accent" />
                      )}
                      <span className="ml-1 hidden sm:inline">Suggest</span>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Found matching socks..." {...field} className={cn(winValue && "pr-10")} />
                      {winValue && (
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
                          onClick={() => handleClear("win")}
                          aria-label="Clear win input"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
                    <FormLabel className="flex items-center gap-2 font-semibold text-sm md:text-base">
                      <span>🩷</span>
                      Today's Gratitude
                    </FormLabel>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleShuffle('gratitude')}
                      disabled={isPending}
                      aria-label="Suggest a gratitude"
                      className="h-9 px-3 rounded-md border-none bg-[#EA3E7D] text-white hover:bg-[#EA3E7D]/90 dark:bg-secondary dark:text-secondary-foreground dark:hover:bg-secondary/80"
                    >
                      {isPending && suggestionTarget === 'gratitude' ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 text-white dark:text-accent" />
                      )}
                      <span className="ml-1 hidden sm:inline">Suggest</span>
                    </Button>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Grateful for the morning coffee..." {...field} className={cn(gratitudeValue && "pr-10")} />
                      {gratitudeValue && (
                        <Button
                          type="button"
                          variant="default"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
                          onClick={() => handleClear("gratitude")}
                          aria-label="Clear gratitude input"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full font-bold" disabled={!form.formState.isValid}>Log Your Growth</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
