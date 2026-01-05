import { Leaf, Menu, Sprout, Users, History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { TabsList, TabsTrigger } from './ui/tabs';
import { MobileNav } from './MobileNav';

export function Header() {
  return (
    <header className="border-b sticky top-0 bg-background/95 z-10">
      <div className="container mx-auto px-4 flex items-center justify-between py-6">
        {/* Mobile Nav */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Desktop Logo (Left) */}
        <div className="hidden md:flex items-center gap-2">
          <Leaf className="text-primary size-7" />
          <h1 className="text-2xl font-headline font-bold text-primary">
            WinBloom
          </h1>
        </div>

        {/* Mobile Logo (Center) */}
        <div className="md:hidden absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2">
            <Leaf className="text-primary size-7" />
            <h1 className="text-2xl font-headline font-bold text-primary">
              WinBloom
            </h1>
          </div>
        </div>

        {/* Desktop Nav (Center) */}
        <div className="hidden md:flex">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
            <TabsTrigger value="garden">
              <Sprout className="mr-2 h-4 w-4" />
              My Garden
            </TabsTrigger>
            <TabsTrigger value="history">
              <History className="mr-2 h-4 w-4" />
              My Growth
            </TabsTrigger>
            <TabsTrigger value="global">
              <Users className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Theme Toggle (Right) */}
        <div className="flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
