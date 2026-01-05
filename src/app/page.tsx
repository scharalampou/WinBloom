import { Header } from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WinBloomDashboard } from '@/components/WinBloomDashboard';
import { GlobalFeed } from '@/components/GlobalFeed';
import { Sprout, Globe } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-body text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="garden" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="garden">
              <Sprout className="mr-2 h-4 w-4" />
              My Garden
            </TabsTrigger>
            <TabsTrigger value="global">
              <Globe className="mr-2 h-4 w-4" />
              Global Bloom Feed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="garden" className="mt-6">
            <WinBloomDashboard />
          </TabsContent>
          <TabsContent value="global" className="mt-6">
            <GlobalFeed />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
