

import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WinBloomDashboard } from '@/components/WinBloomDashboard';
import { GlobalFeed } from '@/components/GlobalFeed';
import { Sprout, Users, History } from 'lucide-react';
import { DailyInspiration } from '@/components/DailyInspiration';
import { GrowthHistory } from '@/components/GrowthHistory';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Tabs defaultValue="garden" className="w-full">
        <Header />
        <main className="container mx-auto px-4 pt-6 pb-8">
            <TabsContent value="garden" className="mt-6 space-y-6">
              <WinBloomDashboard />
            </TabsContent>
            <TabsContent value="history" className="mt-6 space-y-6">
              <GrowthHistory />
            </TabsContent>
            <TabsContent value="global" className="mt-6 space-y-6">
              <GlobalFeed />
              <DailyInspiration />
            </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
