
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Edit, Home } from 'lucide-react';
import { Logo } from './logo';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GrievanceForm = dynamic(() => import('./grievance-form').then(mod => mod.GrievanceForm), {
  ssr: false,
  loading: () => <p>Loading form...</p>
});


export function AppHeader() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 md:gap-3 text-foreground">
          <Logo className="h-7 w-7 md:h-8 md:w-8 text-primary" />
          <h1 className="text-lg md:text-xl font-bold font-headline">Sumbong2Gov</h1>
        </Link>
        <div className="flex items-center gap-2">
          {!isHomePage && (
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Home
                </Link>
              </Button>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="sm">
                <Edit className="mr-2 h-4 w-4" />
                Submit Sumbong
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
              <SheetHeader className="px-2">
                <SheetTitle className="text-2xl">Submit a Sumbong</SheetTitle>
                <SheetDescription>
                  Voice your concerns. Fill out the form below to report an issue. Your submission can be anonymous.
                </SheetDescription>
              </SheetHeader>
              <GrievanceForm onFormSubmit={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
